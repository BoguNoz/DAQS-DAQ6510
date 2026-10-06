import json
import asyncio

from experiment.config.config import save_connection_config, save_channel_map


async def handle_request(websocket, message: str, holder) -> None:
    try:
        command = json.loads(message)
    except json.JSONDecodeError:
        await websocket.send(json.dumps({"error": "invalid JSON"}))
        return

    action = command.get("action")

    if action == "start":
        holder.rebuild()
        await asyncio.to_thread(holder.current.start)
        await websocket.send(json.dumps(holder.current.get_full_history()))
    elif action == "stop":
        await asyncio.to_thread(holder.current.stop)
    elif action == "status":
        await websocket.send(json.dumps({"connected": holder.current.is_connected()}))
    elif action == "update_channel_map":
        if holder.current.is_running():
            await websocket.send(
                json.dumps({"error": "Nie można zmienić konfiguracji w trakcie trwającego eksperymentu"}))
            return
        save_channel_map(command["channels"])
        await websocket.send(json.dumps({"success": True}))
    elif action == "update_connection_config":
        if holder.current.is_running():
            await websocket.send(
                json.dumps({"error": "Nie można zmienić połączenia w trakcie trwającego eksperymentu"}))
            return
        save_connection_config(command["connection"])
        await websocket.send(json.dumps({"success": True}))
    else:
        await websocket.send(json.dumps({"error": f"unknown action: {action}"}))