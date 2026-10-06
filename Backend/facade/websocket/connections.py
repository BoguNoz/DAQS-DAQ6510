import asyncio
import json

connected_clients: set = set()

def register(websocket) -> None:
    connected_clients.add(websocket)

def unregister(websocket) -> None:
    connected_clients.discard(websocket)

async def broadcast(payload: dict) -> None:
    if not connected_clients:
        return
    message = json.dumps(payload)
    await asyncio.gather(
        *(client.send(message) for client in connected_clients),
        return_exceptions=True,
    )