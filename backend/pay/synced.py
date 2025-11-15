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
        asyncio.create_task(self.init())

        self._tracked_users = ["tenminai.korean", "violesdcwev"]

    async def init(self):
        await self._tiktok_service.start()

    @override
    async def on_connect(self):
        await super().on_connect()

        self.channels = []
        self.posts_by_channel_id = {}
        for username in self._tracked_users:
            channel = await self._tiktok_service.get_user_info(username)
            self.channels.append(channel)
            await self.sync()

            async for post in self._tiktok_service.get_user_videos(username):
                self.posts_by_channel_id[channel.id].append(post)
                await self.sync(if_since_last=1 / 60)

    @remote_action
    async def add_channel(self, channel: TiktokChannel):
        self.channels.append(channel)
        await self.sync(toast="Channel added")
