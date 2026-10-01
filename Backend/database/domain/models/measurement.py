from dataclasses import dataclass
from datetime import datetime

@dataclass
class Measurement:
    id: int
    device_id: int
    time: datetime
    t1: float
    t2: float
    voltage: float