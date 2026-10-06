from dataclasses import dataclass
from datetime import datetime

@dataclass
class Device:
    hash: str
    name: str
    logo: str

@dataclass
class Measurement:
    hash: str
    device: Device
    time: datetime
    t1: float
    t2: float
    voltage: float