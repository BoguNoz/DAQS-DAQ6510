from dataclasses import dataclass


@dataclass
class Device:
    id: int
    name: str
    logo: str
    resource_address: str
    use_simulator: bool
    channel_map: dict
