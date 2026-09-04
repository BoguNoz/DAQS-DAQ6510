import pytest
import pyvisa
from pathlib import Path

from daq6510.transport.visa_connection import VisaConnection


@pytest.fixture
def sim_connection():
    sim_file = Path(__file__).parent.parent / "daq6510" / "sim" / "daq6510_sim.yaml"
    rm = pyvisa.ResourceManager(f"{sim_file}@sim")
    connection = VisaConnection("USB::0x05E6::0x6510::12345678::INSTR", rm)
    connection.open()
    yield connection
    connection.close()