import os

from TikTokApi import TikTokApi

ms_token = os.environ.get("ms_token", "")
assert ms_token, "ms_token is not set"


class TiktokService:
    def __init__(self):
        self.api = TikTokApi()

    async def create_sessions(self):
        await self.api.create_sessions(
            ms_tokens=[ms_token],
            num_sessions=1,
            sleep_after=3,
            browser=os.getenv("TIKTOK_BROWSER", "chromium"),
        )


async def user_example():
    async with TikTokApi() as api:
        await api.create_sessions(
            ms_tokens=[ms_token],
            num_sessions=1,
            sleep_after=3,
            browser=os.getenv("TIKTOK_BROWSER", "chromium"),
        )
        user = api.user("therock")
        user_data = await user.info()
        print(user_data)

        async for video in user.videos(count=30):
            print(video)
            print(video.as_dict)

        async for playlist in user.playlists():
            print(playlist)
