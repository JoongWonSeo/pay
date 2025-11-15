# synced object
import logging
from datetime import datetime

from ws_sync import SessionState, SyncedAsCamelCase, remote_action, sync_all

from pay.model import Model

logger = logging.getLogger(__name__)


# data models
class TiktokChannel(Model):
    id: str
    name: str
    description: str
    url: str
    payment_email: str


class TiktokPost(Model):
    id: str
    title: str
    description: str
    url: str
    views: int
    last_updated: datetime


class BackendState(SessionState, SyncedAsCamelCase, Model):
    channels: list[TiktokChannel] = [
        TiktokChannel(
            id="123",
            name="Channel 1",
            description="Description 1",
            url="https://www.tiktok.com/@channel1",
            payment_email="channel1@example.com",
        ),
        TiktokChannel(
            id="456",
            name="Channel 2",
            description="Description 2",
            url="https://www.tiktok.com/@channel2",
            payment_email="channel2@example.com",
        ),
    ]
    posts: list[TiktokPost] = [
        TiktokPost(
            id="456",
            title="Post 1",
            description="Description 1",
            url="https://www.tiktok.com/post1",
            views=100,
            last_updated=datetime.now(),
        ),
    ]

    @sync_all()
    def model_post_init(self, _):
        logger.info(
            f"BackendState initialized with channels: {self.channels} and posts: {self.posts}"
        )

    @remote_action
    async def add_channel(self, channel: TiktokChannel):
        self.channels.append(channel)
        await self.sync(toast="Channel added")
