# synced object
import asyncio
import logging
from datetime import datetime
from typing import override

from ws_sync import SessionState, SyncedAsCamelCase, remote_action, sync_all

from pay.agents.payout_agent import ChatMessage, Payout, PayoutAgentService
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
    post_evaluations: dict[str, TiktokPostEvaluation] = {
        # mocked data
        "7571400659203919106": TiktokPostEvaluation(
            id="7571400659203919106",
            product_mentioned=True,
            prominence_of_product="high",
            target_group_fit="high",
            post_type="demo",
            estimated_ctr=0.2,
        ),
    }
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

        # Calculate price based on factors
        base_price = 1
        penalty_amount = 0
        penalty_reason = None
        bonus_amount = 0
        bonus_reason = None

        # Apply penalty if product not mentioned (-50%)
        if not product_mentioned:
            penalty_amount = 0.5
            penalty_reason = "Product not mentioned in the post"

        # Apply prominence bonus
        if prominence == "high":
            bonus_amount = 0.2
            bonus_reason = "High prominence bonus"
        elif prominence == "medium":
            bonus_amount = 0.1
            bonus_reason = "Medium prominence bonus"

        determined_price_per_1k = round(base_price, 2)
        base_payout = round((post.stats.play_count / 1000) * determined_price_per_1k, 2)
        penalty_payout = (
            round((post.stats.play_count / 1000) * penalty_amount, 2)
            if penalty_amount > 0
            else 0
        )
        bonus_payout = (
            round((post.stats.play_count / 1000) * bonus_amount, 2)
            if bonus_amount > 0
            else 0
        )
        determined_payout = round(base_payout - penalty_payout + bonus_payout, 2)

        evaluation_text = f"This {post_type} post shows {'strong' if product_mentioned else 'no'} product presence with {prominence} prominence. The content aligns {target_fit} with our target audience. Based on engagement metrics and content quality, we estimate a {estimated_ctr:.2f}% CTR. The determined payout reflects the post's impact score and alignment with brand objectives."

        # Generate mock chat history
        chat_history = []
        if product_mentioned:
            chat_history = [
                ChatMessage(
                    role="payout_agent",
                    content=f"Great work on your {post_type} post! The product was prominently featured.",
                    timestamp=datetime.now(),
                ),
                ChatMessage(
                    role="creator",
                    content="Thank you! I tried to showcase it naturally.",
                    timestamp=datetime.now(),
                ),
            ]
        else:
            chat_history = [
                ChatMessage(
                    role="payout_agent",
                    content=f"We noticed the product wasn't mentioned in your {post_type} post. This affects the payout calculation.",
                    timestamp=datetime.now(),
                ),
                ChatMessage(
                    role="creator",
                    content="I understand. I'll make sure to feature the product more clearly next time.",
                    timestamp=datetime.now(),
                ),
            ]

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
        channel = next(channel for channel in self.channels if channel.id == channel_id)
        post = next(
            post for post in self.posts_by_channel_id[channel_id] if post.id == post_id
        )
        post_evaluation = self.post_evaluations[post_id]
        payout = next(
            payout for payout in self.post_payouts[post_id] if payout.date_paid is None
        )

        final_payout = await PayoutAgentService.evaluate_and_pay_for_post(
            creator_channel=channel,
            post=post,
            post_evaluation=post_evaluation,
            chat_between_agent_and_creator=payout.chat_between_agent_and_creator,
            destination_wallet_address="0x063c106d59a9b7aff602e7f1df600a9e10ba15de",
            max_budget=100,
        )
        self.post_payouts[post_id].append(final_payout)
        await self.sync(toast="Payout completed")
