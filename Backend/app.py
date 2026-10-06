import pyvisa
import asyncio

from container import Services
from experiment.config.store import JsonConfigStore
from experiment.service.experiment_service import ExperimentService
from experiment.utils.factory import build_orchestrator


async def main() -> None:
    rm = pyvisa.ResourceManager("daq6510/sim/daq6510_sim.yaml@sim")

    print(rm.list_resources())

    config_store = JsonConfigStore()
    experiment_service = ExperimentService(build_orchestrator, config_store)

    services = Services(experiment=experiment_service)


if __name__ == "__main__":
    asyncio.run(main())