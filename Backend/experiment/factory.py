import os
from pathlib import Path
import pyvisa

from daq6510.instrument import DAQ6510
from daq6510.transport.visa_connection import VisaConnection
from experiment.config import KALMAN_PROCESS_VARIANCE, KALMAN_MEASUREMENT_VARIANCE
from experiment.orchestrator import Orchestrator


def build_orchestrator() -> Orchestrator:
    use_simulator = os.getenv("USE_SIMULATOR", "true").lower() == "true"

    if use_simulator:
        sim_file = Path(__file__).parent.parent / "daq6510" / "sim" / "daq6510_sim.yaml"
        resource_manager = pyvisa.ResourceManager(f"{sim_file}@sim")
        resource_address = "USB::0x05E6::0x6510::12345678::INSTR"
    else:
        resource_manager = pyvisa.ResourceManager("@py")
        resource_address = os.getenv("DAQ6510_RESOURCE_ADDRESS")

    connection = VisaConnection(resource_address, resource_manager)
    connection.open()


    daq = DAQ6510(connection)
    return Orchestrator(
        daq,
        process_variance=KALMAN_PROCESS_VARIANCE,
        measurement_variance=KALMAN_MEASUREMENT_VARIANCE,
    )
