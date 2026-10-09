import asyncio

from database.service.database_service import DatabaseService
from facade.websocket.router import Router
from facade.websocket.utils.handlers_actions import DatabaseActions


class DatabaseHandlers:
    def __init__(self, service: DatabaseService) -> None:
        self._service = service

    def register(self, router: Router) -> None:
        router.add(DatabaseActions.LIST_MEASUREMENTS.value, self.list_measurements)

    async def list_measurements(self, payload: dict) -> dict:
        items, total = await asyncio.to_thread(
            self._service.list_measurements,
            payload.get("filters", []),
            payload.get("page_index", 0),
            payload.get("page_size", 20),
        )
        return {"items": items, "total": total}