import os
from pathlib import Path
import pyvisa

from daq6510.instrument import DAQ6510
from daq6510.transport.visa_connection import VisaConnection
from experiment.config.config import KALMAN_PROCESS_VARIANCE, KALMAN_MEASUREMENT_VARIANCE, load_channel_map, \
    load_connection_config
from experiment.orchestrator import Orchestrator


def build_orchestrator() -> Orchestrator:
    connection_config = load_connection_config()
    channel_map = load_channel_map()

    if connection_config["use_simulator"]:
        sim_file = Path(__file__).parent.parent / "daq6510" / "sim" / "daq6510_sim.yaml"
        resource_manager = pyvisa.ResourceManager(f"{sim_file}@sim")
        resource_address = "USB::0x05E6::0x6510::12345678::INSTR"
    else:
        resource_manager = pyvisa.ResourceManager("@py")
        resource_address = connection_config["resource_address"]

    connection = VisaConnection(resource_address, resource_manager)
    connection.open()

    daq = DAQ6510(connection)
    return Orchestrator(daq, channel_map, KALMAN_PROCESS_VARIANCE, KALMAN_MEASUREMENT_VARIANCE)
