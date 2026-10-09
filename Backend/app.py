import pyvisa
import asyncio

from container import Services
from database.infrastructure.connection import SessionFactory
from database.service.database_service import DatabaseService
from experiment.config.store import JsonConfigStore
from experiment.service.experiment_service import ExperimentService
from experiment.utils.factory import build_orchestrator
from facade.api import build_websocket_api


async def main() -> None:
    rm = pyvisa.ResourceManager("daq6510/sim/daq6510_sim.yaml@sim")

    print(rm.list_resources())

    config_store = JsonConfigStore()
    experiment_service = ExperimentService(build_orchestrator, config_store)

    database_service = DatabaseService(SessionFactory)

    services = Services(experiment=experiment_service, database=database_service)

    api = build_websocket_api(services)

    try:
        await api.run()
    finally:
        await asyncio.to_thread(experiment_service.shutdown)


if __name__ == "__main__":
    asyncio.run(main())