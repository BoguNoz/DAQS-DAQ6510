from dataclasses import dataclass
from datetime import datetime
from typing import Optional

@dataclass
class Experiment:
    id: Optional[int]
    started_at: datetime
    finished_at: Optional[datetime]
    thermocouple_1_temperature: Optional[float]
    thermocouple_2_temperature: Optional[float]
    voltage: Optional[float]
    seebeck_coefficient: Optional[float]
    is_active: bool = True