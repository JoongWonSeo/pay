# synced object
import asyncio
import logging
from typing import override

from ws_sync import SessionState, SyncedAsCamelCase, remote_action, sync_all

from pay.model import Model
from pay.tiktok import TiktokChannel, TiktokPost, TiktokService

logger = logging.getLogger(__name__)


class BackendState(SessionState, SyncedAsCamelCase, Model):
    channels: list[TiktokChannel] = []
    posts_by_channel_id: dict[str, list[TiktokPost]] = {}

    @sync_all()
    def model_post_init(self, _):
        self._tiktok_service = TiktokService()
        self._task_init = asyncio.create_task(self._tiktok_service.start())

        self._tracked_users = ["tenminai.korean", "violesdcwev"]
        self._task_fetch_from_tiktok: asyncio.Task[None] | None = None

    @override
    async def on_connect(self):
        await self._task_init
        self._task_fetch_from_tiktok = asyncio.create_task(self.fetch_from_tiktok())

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
