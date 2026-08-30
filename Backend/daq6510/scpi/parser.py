from daq6510.scpi.exceptions import IdnFormatResponseError, ReadingValuesError


def parse_idn(raw_response: str) -> dict:
    parts = raw_response.strip().split(",")

    if len(parts) != 4:
        raise IdnFormatResponseError()

    return {
        "manufacturer": parts[0].strip(),
        "model": parts[1].strip(),
        "serial_number": parts[2].strip(),
        "firmware_version": parts[3].strip(),
    }

def parse_reading_values(raw_response: str) -> list[float]:
    parts = raw_response.strip().split(",")
    try:
        return [float(p) for p in parts if p]
    except ValueError as e:
        raise ReadingValuesError(str(e)) from e