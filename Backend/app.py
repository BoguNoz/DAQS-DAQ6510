import pyvisa
import asyncio

from container import Services
from database.infrastructure.connection import get_session
from database.service.database_service import DatabaseService
from experiment.config.store import JsonConfigStore
from experiment.service.experiment_service import ExperimentService
from experiment.utils.factory import build_orchestrator


async def main() -> None:
    rm = pyvisa.ResourceManager("daq6510/sim/daq6510_sim.yaml@sim")

    print(rm.list_resources())

    config_store = JsonConfigStore()
    experiment_service = ExperimentService(build_orchestrator, config_store)

    session = get_session()
    database_service = DatabaseService(session)

    services = Services(experiment=experiment_service, database=database_service)


if __name__ == "__main__":
    asyncio.run(main())