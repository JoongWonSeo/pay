import os
from datetime import datetime

from TikTokApi import TikTokApi

from pay.model import Model

ms_token = os.environ.get("ms_token", "")
assert ms_token, "ms_token is not set"


#  ========= user/channel stats ========= #
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


#  ========= post ========= #
class TiktokPostStats(Model):
    play_count: int
    """number of views/plays"""
    like_count: int
    """number of likes"""
    comment_count: int
    """number of comments"""
    share_count: int
    """number of shares"""
    save_count: int
    """number of saves/bookmarks"""


class TiktokPost(Model):
    id: str
    """id as a internal integer"""
    date_posted: datetime
    """Date posted"""
    description: str
    """Post description"""
    url: str | None
    """Post URL, if available"""
    dynamic_cover_url: str
    """Dynamic cover URL"""
    stats: TiktokPostStats
    """Post aggregated stats"""


class TiktokService:
    def __init__(self):
        self.api = TikTokApi()

    async def start(self):
        await self.api.__aenter__()
        await self.create_sessions()

    async def end(self):
        await self.api.__aexit__(None, None, None)

    async def create_sessions(self):
        await self.api.create_sessions(
            ms_tokens=[ms_token],
            num_sessions=1,
            sleep_after=3,
            browser=os.getenv("TIKTOK_BROWSER", "chromium"),
            headless=False,
        )

    async def get_user_info(self, username: str) -> TiktokChannel:
        user = self.api.user(username)
        user_data = (await user.info())["userInfo"]
        return TiktokChannel(
            id=user_data["user"]["id"],
            nickname=user_data["user"]["nickname"],
            handle=user_data["user"]["uniqueId"],
            description=user_data["user"]["signature"],
            avatar_url=user_data["user"]["avatarLarger"],
            stats=TiktokUserStats(
                follower_count=user_data["stats"]["followerCount"],
                following_count=user_data["stats"]["followingCount"],
                heart_count=user_data["stats"]["heartCount"],
                video_count=user_data["stats"]["videoCount"],
            ),
        )

    async def get_user_videos(self, username: str):
        user = self.api.user(username)
        async for video in user.videos(count=30):
            print(video)
            print(video.as_dict)


# async def user_example():
#     async with TikTokApi() as api:
#         await api.create_sessions(
#             ms_tokens=[ms_token],
#             num_sessions=1,
#             sleep_after=3,
#             browser=os.getenv("TIKTOK_BROWSER", "chromium"),
#         )
#         user = api.user("therock")
#         user_data = await user.info()
#         print(user_data)

#         async for video in user.videos(count=30):
#             print(video)
#             print(video.as_dict)

#         async for playlist in user.playlists():
#             print(playlist)
