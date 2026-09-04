import pytest
from daq6510.scpi.commands import ScpiCommands
from daq6510.scpi.exceptions import TcTypeValueError

def test_set_thermocouple_type_builds_correct_command():
    result = ScpiCommands.set_thermocouple_type("101", "K")
    assert result == "SENS:TEMP:TC:TYPE K, (@101)"

def test_set_thermocouple_type_rejects_invalid_type():
    with pytest.raises(TcTypeValueError):
        ScpiCommands.set_thermocouple_type("101", "X")

@pytest.mark.parametrize("tc_type", ["B", "E", "J", "K", "N", "R", "S", "T"])
def test_set_thermocouple_type_accepts_all_valid_types(tc_type):
    result = ScpiCommands.set_thermocouple_type("101", tc_type)
    assert tc_type in result