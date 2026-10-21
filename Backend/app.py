from functools import partial

import pyvisa
import asyncio

from adapters.measurement_sink import DatabaseMeasurementSink
from container import Services
from database.infrastructure.database.connection import SessionFactory
from database.infrastructure.database.dev_seed import seed_dev_data
from database.infrastructure.database.init import init_database
from database.service.database_service import DatabaseService
from experiment.config.config import resource_path
from experiment.config.store import JsonConfigStore
from experiment.service.experiment_service import ExperimentService
from experiment.utils.factory import build_orchestrator
from facade.api import build_websocket_api

import asyncio
import sys
from pathlib import Path

from aiohttp import web

def build_frontend_app() -> web.Application:
    dist_dir = resource_path("forntend", "dist")

    app = web.Application()

    async def index(request):
        return web.FileResponse(str(dist_dir / "index.html"))

    app.router.add_get("/", index)
    app.router.add_static("/", str(dist_dir), show_index=True)
    return app

def get_sim_path(relative_path: str) -> str:
    # Obsługuje zarówno tryb deweloperski, jak i spakowany .exe/.app
    if getattr(sys, "frozen", False) and hasattr(sys, "_MEIPASS"):
        base_path = Path(sys._MEIPASS)
    else:
        base_path = Path(__file__).resolve().parent

    return str(base_path / relative_path)

async def main() -> None:
    sim_yaml = get_sim_path("daq6510/sim/daq6510_sim.yaml")
    rm = pyvisa.ResourceManager(f"{sim_yaml}@sim")

    print(rm.list_resources())

    await asyncio.to_thread(init_database)
    await asyncio.to_thread(seed_dev_data)

    database_service = DatabaseService(SessionFactory)
    measurement_sink = DatabaseMeasurementSink(database_service)

    config_store = JsonConfigStore()
    experiment_service = ExperimentService(partial(build_orchestrator, measurement_sink), config_store)


    services = Services(experiment=experiment_service, database=database_service)

    api = build_websocket_api(services, host="0.0.0.0", port=12345)

    try:
        await api.run()
    finally:
        pass


if __name__ == "__main__":
    asyncio.run(main())