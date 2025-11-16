# synced object
import asyncio
import logging
from datetime import datetime
from typing import override

from ws_sync import SessionState, SyncedAsCamelCase, remote_action, sync_all

from pay.agents.payout_agent import (
    ChatBetweenAgentAndCreator,
    ChatMessage,
    Payout,
    PayoutAgentService,
)
from pay.agents.post_evaluation_agent import TiktokPostEvaluation
from pay.model import Model
from pay.tiktok import TiktokChannel, TiktokPost, TiktokService

logger = logging.getLogger(__name__)


def _log_task_exception(task: asyncio.Task):
    """Log exceptions from completed tasks."""
    try:
        task.result()
    except asyncio.CancelledError:
        pass  # Task cancellation is expected, don't log
    except Exception:
        logger.exception(f"Exception in task {task.get_name()}")


class BackendState(SessionState, SyncedAsCamelCase, Model):
    channels: list[TiktokChannel] = []
    posts_by_channel_id: dict[str, list[TiktokPost]] = {}
    post_evaluations: dict[str, TiktokPostEvaluation] = {}
    """Post evaluations by post id"""
    post_payouts: dict[str, list[Payout]] = {}
    """Payout history by post id"""

    @sync_all()
    def model_post_init(self, _):
        self._tiktok_service = TiktokService()
        self._task_init = asyncio.create_task(self._tiktok_service.start())
        self._task_init.add_done_callback(_log_task_exception)

        self._tracked_users = ["tenminai.korean", "violesdcwev"]
        self._task_fetch_from_tiktok: asyncio.Task[None] | None = None

    @override
    async def on_connect(self):
        await self._task_init
        self._task_fetch_from_tiktok = asyncio.create_task(self.fetch_from_tiktok())
        self._task_fetch_from_tiktok.add_done_callback(_log_task_exception)

    async def fetch_from_tiktok(self):
        self.channels = []
        self.posts_by_channel_id = {}
        for username in self._tracked_users:
            channel = await self._tiktok_service.get_user_info(username)
            self.channels.append(channel)
            await self.sync()

            async for post in self._tiktok_service.get_user_videos(username):
                if not self.posts_by_channel_id.get(channel.id):
                    self.posts_by_channel_id[channel.id] = []
                self.posts_by_channel_id[channel.id].append(post)

                # Generate mock evaluation for each post
                self._generate_mock_evaluation(post)

                await self.sync(if_since_last=1 / 60)
        await self.sync(toast="Finished fetching from TikTok")

    def _generate_mock_evaluation(self, post: TiktokPost):
        """Generate mock evaluation data for a post"""
        import random

        post_types = ["demo", "review", "product recommendation", "trend", "other"]
        prominence_levels = ["high", "medium", "low"]
        target_fit_levels = ["high", "medium", "low"]

        product_mentioned = random.choice([True, False])
        prominence = random.choice(prominence_levels)
        target_fit = random.choice(target_fit_levels)
        post_type = random.choice(post_types)
        estimated_ctr = random.uniform(0.2, 5.0)

        evaluation_text = f"This {post_type} post shows {'strong' if product_mentioned else 'no'} product presence with {prominence} prominence. The content aligns {target_fit} with our target audience. Based on engagement metrics and content quality, we estimate a {estimated_ctr:.2f}% CTR."

        self.post_evaluations[post.id] = TiktokPostEvaluation(
            id=post.id,
            product_mentioned=product_mentioned,
            prominence_of_product=prominence,
            target_group_fit=target_fit,
            post_type=post_type,
            estimated_ctr=round(estimated_ctr, 2),
            date_evaluated=datetime.now(),
            evaluation_text=evaluation_text,
        )

    @remote_action
    async def add_channel(self, channel: TiktokChannel):
        self.channels.append(channel)
        await self.sync(toast="Channel added")

    @remote_action
    async def evaluate_and_pay_for_post(self, channel_id: str, post_id: str):
        try:
            channel = next(
                channel for channel in self.channels if channel.id == channel_id
            )
            post = next(
                post
                for post in self.posts_by_channel_id[channel_id]
                if post.id == post_id
            )
            post_evaluation = self.post_evaluations[post_id]

            final_payout = await PayoutAgentService.evaluate_and_pay_for_post(
                creator_channel=channel,
                post=post,
                post_evaluation=post_evaluation,
                chat_between_agent_and_creator=ChatBetweenAgentAndCreator(
                    chat_history=[
                        ChatMessage(
                            role="creator",
                            content="Hi I've just created my post, and I'm proud of the quality of the content",
                            timestamp=datetime.now(),
                        )
                    ]
                ),
                destination_wallet_address="0x063c106d59a9b7aff602e7f1df600a9e10ba15de",
                max_budget=4,
            )
            if not self.post_payouts.get(post_id):
                self.post_payouts[post_id] = []
            self.post_payouts[post_id].append(final_payout)
            await self.sync(
                toast=f"Payout completed: {final_payout.determined_final_payout} USDC"
            )
        except Exception as e:
            logger.exception(f"Error evaluating and paying for post {post_id}: {e}")
            await self.sync(
                toast=f"Error evaluating and paying for post {post_id}: {e}"
            )
