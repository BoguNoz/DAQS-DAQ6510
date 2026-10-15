from functools import partial

import pyvisa
import asyncio

from adapters.measurement_sink import DatabaseMeasurementSink
from container import Services
from database.infrastructure.database.session import SessionFactory
from database.infrastructure.database.dev_seed import seed_dev_data
from database.infrastructure.database.init import init_database
from database.service.database_service import DatabaseService
from experiment.config.store import JsonConfigStore
from experiment.service.experiment_service import ExperimentService
from experiment.utils.factory import build_orchestrator
from facade.api import build_websocket_api


async def main() -> None:
    rm = pyvisa.ResourceManager("daq6510/sim/daq6510_sim.yaml@sim")

    print(rm.list_resources())

    await asyncio.to_thread(init_database)
    await asyncio.to_thread(seed_dev_data)

    database_service = DatabaseService(SessionFactory)
    measurement_sink = DatabaseMeasurementSink(database_service)

    config_store = JsonConfigStore()
    experiment_service = ExperimentService(partial(build_orchestrator, measurement_sink), config_store)


    services = Services(experiment=experiment_service, database=database_service)

    api = build_websocket_api(services)

    try:
        await api.run()
    finally:
        await asyncio.to_thread(experiment_service.shutdown)


if __name__ == "__main__":
    asyncio.run(main())