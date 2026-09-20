import asyncio
import websockets

from experiment.factory import build_orchestrator
from experiment.orchestrator import Orchestrator
from websocket.connections import register, unregister, connected_clients, broadcast
from websocket.handlers import handle_request

class OrchestratorHolder:
    def __init__(self):
        self.current: Orchestrator = build_orchestrator()

    def rebuild(self) -> None:
        old = self.current
        old.disconnect_instrument()
        self.current = build_orchestrator()

holder = OrchestratorHolder()

async def handle(websocket):
    register(websocket)
    try:
        async for message in websocket:
            await handle_request(websocket, message, holder)
    except websockets.exceptions.ConnectionClosed:
        pass
    finally:
        unregister(websocket)

async def broadcast_loop(interval: float = 1.0) -> None:
    while True:
        state = holder.current.get_current_state()
        await broadcast(state)
        await asyncio.sleep(interval)

async def main():
    server = await websockets.serve(handle, "localhost", 12345)
    await asyncio.gather(server.wait_closed(), broadcast_loop())

if __name__ == "__main__":
    asyncio.run(main())