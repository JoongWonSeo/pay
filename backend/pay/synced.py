# synced object
import asyncio
import logging
from datetime import datetime
from typing import override

from ws_sync import SessionState, SyncedAsCamelCase, remote_action, sync_all

from pay.agents.payout_agent import ChatBetweenAgentAndCreator, ChatMessage, Payout
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
        "1": TiktokPostEvaluation(
            id="1",
            product_mentioned=True,
            prominence_of_product="high",
            target_group_fit="high",
            post_type="demo",
            estimated_ctr=0.2,
        ),
    }
    """Post evaluations by post id"""
    post_payouts: dict[str, list[Payout]] = {
        "1": [
            Payout(
                chat_between_agent_and_creator=ChatBetweenAgentAndCreator(
                    chat_history=[
                        ChatMessage(
                            role="payout_agent",
                            content="Hello, how are you?",
                            timestamp=datetime.now(),
                        ),
                        ChatMessage(
                            role="creator",
                            content="I'm good, thank you!",
                            timestamp=datetime.now(),
                        ),
                    ]
                ),
                number_of_views=100,
                determined_price_per_1k=1,
                determined_base_payout=100,
                determined_penalty=10,
                penalty_reason="The post is not relevant to the target group",
                determined_bonus=30,
                bonus_reason="The post is well-crafted and engaging",
                determined_final_payout=120,
                date_paid=datetime.now(),
            )
        ]
    }
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
                await self.sync(if_since_last=1 / 60)
        await self.sync(toast="Finished fetching from TikTok")

    @remote_action
    async def add_channel(self, channel: TiktokChannel):
        self.channels.append(channel)
        await self.sync(toast="Channel added")
