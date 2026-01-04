from fastapi import APIRouter, WebSocket, Depends
from sqlalchemy.orm import Session
from ..database import SessionLocal
from ..services.collaboration_ai import CollaborationAIService
from openai import RateLimitError, OpenAIError

router = APIRouter(prefix="/collaboration-ai", tags=["Agentic AI"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

service = CollaborationAIService()

@router.websocket("/ws")
async def collaboration_ai_ws(websocket: WebSocket, db: Session = Depends(get_db)):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_json()
            task = data.get("task")
            if not task:
                await websocket.send_json({"type": "error", "message": "No task provided."})
                continue

            await websocket.send_json({
                "type": "status",
                "message": "Analyzing collaboration opportunities..."
            })

            result = await service.generate_suggestions(db, task)

            if "error" in result:
                await websocket.send_json({"type": "error", "message": result["error"]})
            else:
                await websocket.send_json({"type": "result", "data": result})

    except Exception as ws_error:
        print("WebSocket error:", ws_error)
    finally:
        if websocket.client_state.name != "DISCONNECTED":
            await websocket.close()