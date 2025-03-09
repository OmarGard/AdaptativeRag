from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from pprint import pprint
from websocket_manager import WebSocketManager
from config import app
from state_graph import agent
from load_secrets import load_secrets

manager = WebSocketManager()
load_secrets()

@app.get('/')
async def root():
    return {"message": "Hello World"}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_json()
            print("............. DATA ..............")
            print(data)
            inputs = {"question": data["question"], "websocket": websocket, "attempts": 0, "manager": manager}
            async for event in agent.astream(inputs):
                for key, value in event.items():
                    pprint(f"Finished running: {key}:")
            # Final Generation        
            await manager.send_message(websocket, value["generation"], "generation")
            pprint(value["generation"])
    except WebSocketDisconnect:
        manager.disconnect(websocket)