# synced object
import logging
from datetime import datetime

from ws_sync import SessionState, SyncedAsCamelCase, remote_action, sync_all

from pay.model import Model
from pay.tiktok import TiktokChannel, TiktokPost, TiktokPostStats, TiktokUserStats

logger = logging.getLogger(__name__)


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
            id="1",
            date_posted=datetime.fromtimestamp(1762854097),
            description="post description",
            url=None,
            dynamic_cover_url="https://p16-common-sign.tiktokcdn-us.com/tos-no1a-p-0037-no/oo6ZsBSITniwFtefEg5TqkpNBgR9EAg4iISBBP~tplv-tiktokx-origin.image?dr=9636&x-expires=1763413200&x-signature=IhGXyXSLlWVOEb6thck89hlL5vg%3D&t=4d5b0474&ps=13740610&shp=81f88b70&shcp=43f4a2f9&idc=useast8",
            stats=TiktokPostStats(
                play_count=1234,
                like_count=100,
                comment_count=32,
                share_count=340,
                save_count=450,
            ),
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
