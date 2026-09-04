from daq6510.scpi.parser import parse_idn, parse_reading_values
from daq6510.scpi.exceptions import IdnFormatResponseError, ReadingValuesError
import pytest

def test_parse_idn_valid_response():
    raw = "KEITHLEY INSTRUMENTS,MODEL DAQ6510,12345678,1.0.0"
    result = parse_idn(raw)
    assert result["model"] == "MODEL DAQ6510"

def test_parse_idn_rejects_malformed_response():
    with pytest.raises(IdnFormatResponseError):
        parse_idn("za mało pól")
