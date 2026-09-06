import json
import asyncio

async def handle_request(websocket, message: str, orchestrator) -> None:
    try:
        command = json.loads(message)
    except json.JSONDecodeError:
        await websocket.send(json.dumps({"error": "invalid JSON"}))
        return

    action = command.get("action")

    if action == "start":
        await asyncio.to_thread(orchestrator.start)
        await websocket.send(json.dumps(orchestrator.get_full_history()))
    elif action == "stop":
        await asyncio.to_thread(orchestrator.stop)
    else:
        await websocket.send(json.dumps({"error": f"unknown action: {action}"}))