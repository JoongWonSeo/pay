import asyncio
import logging
from functools import cache

from fastapi import FastAPI, HTTPException, WebSocket
from fastapi.openapi.utils import get_openapi
from ws_sync import Session
from ws_sync.synced_model import registered_synced_models

from pay.synced import BackendState

logger = logging.getLogger(__name__)
app = FastAPI()


# Global asyncio exception handler to catch errors in tasks
def asyncio_exception_handler(loop, context):
    """Handle exceptions that occur in asyncio tasks."""
    exception = context.get("exception")
    message = context.get("message", "Unhandled exception in asyncio task")

    if exception:
        logger.error(
            f"Asyncio task exception: {message}",
            exc_info=(type(exception), exception, exception.__traceback__)
        )
    else:
        logger.error(f"Asyncio task error: {message}", extra={"context": context})


@app.on_event("startup")
async def setup_asyncio_exception_handler():
    """Set up global asyncio exception handler on application startup."""
    loop = asyncio.get_running_loop()
    loop.set_exception_handler(asyncio_exception_handler)
    logger.info("Asyncio exception handler configured")


@app.get("/")
def read_root():
    return {"Hello": "World"}


# ========== websocket frontend dashboard sessions ========== #
sessions: dict[str, Session] = {}


@app.websocket("/ws/{session_id}")
async def websocket_endpoint(ws: WebSocket, session_id: str):
    if session_id not in sessions:
        logger.info(f"Creating new session: {session_id}")
        session = Session()
        with session:
            session.state = BackendState()

        sessions[session_id] = session  # save session to global sessions dict
    else:
        logger.info(f"Session already exists: {session_id}")
        session = sessions[session_id]

    await session.handle_connection(ws)


# ========== ws-sync json schema endpoints ========== #
@app.get("/ws-sync/all_models")
async def all_models():
    return list(registered_synced_models.keys())


# route for individual playground models
@app.api_route(
    "/ws-sync/{model}/openapi.json",
    methods=["GET", "HEAD"],
    include_in_schema=False,
)
@cache
def openapi_playground(model: str):
    if model not in registered_synced_models:
        raise HTTPException(status_code=404, detail="Model not found")

    synced_model = registered_synced_models[model]

    spec = get_openapi(
        title=model,
        version="0.0.1",
        routes=[],
    )
    spec = synced_model.attach_to_openapi(spec)
    return spec


# Filter out /endpoint
logging.getLogger("uvicorn.access").addFilter(
    lambda record: record.getMessage().find("/openapi.json") == -1
)
