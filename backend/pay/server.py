import logging
from functools import cache

from fastapi import FastAPI, HTTPException, WebSocket
from fastapi.openapi.utils import get_openapi
from ws_sync import Session
from ws_sync.synced_model import registered_synced_models

from pay.hello import HelloSync

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


# ========== websocket frontend dashboard sessions ========== #
sessions: dict[str, Session] = {}


@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    session_id = "default"
    logging.info(f"Websocket connection established for session: {session_id}")
    if session_id not in sessions:
        logging.info(f"Creating new session: {session_id}")
        session = Session()
        sessions[session_id] = session

        # init session state
        with session:
            session.state = HelloSync(message="inited")
    else:
        logging.info(f"Session already exists: {session_id}")

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
