# synced object
import logging
from datetime import datetime

from ws_sync import SessionState, SyncedAsCamelCase, remote_action, sync_all

from pay.model import Model

logger = logging.getLogger(__name__)


# data models


class TiktokUserStats(Model):
    follower_count: int
    following_count: int
    heart_count: int
    video_count: int


class TiktokChannel(Model):
    id: str
    """id as a internal integer"""
    nickname: str
    """To show as UI"""
    handle: str
    """In the twitter @handle format"""
    description: str
    """Profile description"""
    avatar_url: str
    """Profile avatar URL"""
    stats: TiktokUserStats
    """User aggregated stats"""

    # # payment
    # payment_email: str
    # "


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
            nickname="Channel 1",
            handle="channel1",
            description="Description 1",
            avatar_url="https://p16-common-sign.tiktokcdn-us.com/tos-maliva-avt-0068/f611aa99e7db2b1f81ce145c7b063078~tplv-tiktokx-cropcenter:1080:1080.jpeg?dr=9640&refresh_token=cb4d1315&x-expires=1763413200&x-signature=tkYPKZGSeWlK%2BYxuvzFyhzRxR%2FI%3D&t=4d5b0474&ps=13740610&shp=a5d48078&shcp=81f88b70&idc=useast8",
            stats=TiktokUserStats(
                follower_count=100,
                following_count=100,
                heart_count=100,
                video_count=100,
            ),
        ),
    ]
    posts: list[TiktokPost] = [
        TiktokPost(
            id="456",
            title="Post 1",
            description="Description 1",
            url="https://www.tiktok.com/post1",
            views=100,
            last_updated=datetime.fromisoformat("2025-11-15T12:00:00Z"),
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
