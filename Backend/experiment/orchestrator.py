import threading
import time

from daq6510.instrument import DAQ6510
from daq6510.transport.exceptions import InstrumentError
from experiment.config import CHANNEL_MAP
from experiment.kalman import ScalarKalmanFilter
from experiment.seebeck import calculate_seebeck_coefficient
from experiment.stability import StabilityDetector

from experiment.state import SharedExperimentData, ExperimentState


class Orchestrator:
    def __init__(
            self,
            daq: DAQ6510,
            process_variance: float,
            measurement_variance: float,
            poll_interval_seconds: float = 1.0,
            max_consecutive_errors: int = 5,
    ):
        self._daq = daq
        self._poll_interval = poll_interval_seconds
        self._shared_data = SharedExperimentData()
        self._temp_detector_1 = StabilityDetector()
        self._temp_detector_2 = StabilityDetector()
        self._voltage_detector = StabilityDetector()
        self._voltage_filter = ScalarKalmanFilter(
            process_variance=process_variance,
            measurement_variance=measurement_variance
        )

        self._stop_event = threading.Event()
        self._thread: threading.Thread = None

        self._max_consecutive_errors = max_consecutive_errors
        self._consecutive_errors = 0

    def start(self) -> None:
        self._setup_channels()
        self._thread = threading.Thread(target=self._run_loop, daemon=True)
        self._thread.start()

    def _setup_channels(self) -> None:
        from experiment.config import CHANNEL_MAP
        t1 = CHANNEL_MAP["thermocouple_1"].address
        t2 = CHANNEL_MAP["thermocouple_2"].address
        voltage = CHANNEL_MAP["voltage_probe"].address

        self._daq.set_function_temperature(t1)
        self._daq.set_thermocouple_type(t1, "K")
        self._daq.set_function_temperature(t2)
        self._daq.set_thermocouple_type(t2, "K")
        self._daq.set_function_voltage_dc(voltage)
        self._daq.create_scan([t1, t2, voltage])

    def stop(self) -> None:
        self._stop_event.set()
        if self._thread:
            self._thread.join()

    def get_current_state(self) -> dict:
        return self._shared_data.snapshot()

    def get_full_history(self) -> dict:
        return self._shared_data.full_history()

    def _run_loop(self) -> None:
        while not self._stop_event.is_set():
            try:
                self._daq.initiate()
                readings = self._daq.read_scan_data(count=3)
                self._step(readings)
                self._consecutive_errors = 0  # reset po udanym kroku
            except InstrumentError as e:
                self._consecutive_errors += 1
                if self._consecutive_errors >= self._max_consecutive_errors:
                    # TODO: oznacz eksperyment jako nieudany (np. przez repository.deactivate) i zatrzymaj pętlę
                    self._stop_event.set()
            time.sleep(self._poll_interval)

    def _step(self, readings: dict[str, float]) -> None:
        state = self._shared_data.state
        if state == ExperimentState.MEASURING_TEMPERATURE:
            self._step_measuring_temperature(readings)
        elif state == ExperimentState.MEASURING_VOLTAGE:
            self._step_measuring_voltage(readings)
        elif state == ExperimentState.DONE:
            self._stop_event.set()

    def _step_measuring_temperature(self, readings: dict[str, float]) -> None:
        t1 = readings[CHANNEL_MAP["thermocouple_1"].address]
        t2 = readings[CHANNEL_MAP["thermocouple_2"].address]

        self._temp_detector_1.add_sample(t1)
        self._temp_detector_2.add_sample(t2)
        self._shared_data.update_temperatures(t1, t2)

        if self._temp_detector_1.is_stable() and self._temp_detector_2.is_stable():
            self._shared_data.transition_to(ExperimentState.MEASURING_VOLTAGE)

    def _step_measuring_voltage(self, readings: dict[str, float]) -> None:
        raw_voltage = readings[CHANNEL_MAP["voltage_probe"].address]

        filtered_voltage = self._voltage_filter.update(raw_voltage)

        self._voltage_detector.add_sample(filtered_voltage)
        self._shared_data.update_voltage(filtered_voltage)

        if self._voltage_detector.is_stable():
            data = self._shared_data.snapshot()
            delta_t = data["thermocouple_1_temperature"] - data["thermocouple_2_temperature"]
            coefficient = calculate_seebeck_coefficient(filtered_voltage, delta_t)
            self._shared_data.update_seebeck_coefficient(coefficient)
            self._shared_data.transition_to(ExperimentState.DONE)