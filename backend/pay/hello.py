# synced object
from ws_sync import SessionState, SyncedAsCamelCase, remote_action, sync_all

from pay.model import Model


class HelloSync(SyncedAsCamelCase, Model, SessionState):
    message: str = "Hello, world!"

    @sync_all()
    def __model_post_init__(self): ...

    @remote_action
    async def set_message(self, message: str):
        self.message = message
        await self.sync()
