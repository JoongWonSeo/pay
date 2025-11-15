# synced object
import logging

from ws_sync import SessionState, SyncedAsCamelCase, remote_action, sync_all

from pay.model import Model


class HelloSync(SyncedAsCamelCase, Model, SessionState):
    message: str = "hey what's up"

    @sync_all()
    def __model_post_init__(self):
        logging.info(f"HelloSync initialized with message: {self.message}")

    @remote_action
    async def set_message(self, message: str):
        self.message = message + " (backend updated)"
        await self.sync(toast="message updated")
