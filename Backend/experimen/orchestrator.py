from daq6510.instrument import DAQ6510
from experimen.kalman import ScalarKalmanFilter
from experimen.stability import StabilityDetector

from enum import Enum, auto

class ExperimentState(Enum):
    MEASURING_TEMPERATURE = auto()
    TEMPERATURE_STABLE = auto()
    MEASURING_VOLTAGE = auto()
    VOLTAGE_STABLE = auto()
    DONE = auto()

class Orchestrator:
    def __init__(self, daq: DAQ6510, process_variance: float, measurement_variance: float,):
        self._daq = daq
        self._state = ExperimentState.MEASURING_TEMPERATURE
        self._temp_detector_1 = StabilityDetector()
        self._temp_detector_2 = StabilityDetector()
        self._voltage_detector = StabilityDetector()
        self._voltage_filter = ScalarKalmanFilter(
            process_variance=process_variance,
            measurement_variance=measurement_variance
        )

