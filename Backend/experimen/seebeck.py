from experimen.exceptions import SeebeckValueRangeException


def calculate_seebeck_coefficient(delta_voltage: float, delta_temperature: float) -> float:
    if delta_temperature == 0:
        raise SeebeckValueRangeException()
    return delta_voltage / delta_temperature