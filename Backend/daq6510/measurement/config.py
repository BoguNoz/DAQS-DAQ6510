from dataclasses import dataclass

@dataclass
class ChannelRole:
    name: str           # np. "thermocouple_1", "voltage_probe"
    address: str        # np. "101" — jedyne miejsce, gdzie wpisujesz fizyczny kanał

CHANNEL_MAP = {
    "thermocouple_1": ChannelRole("thermocouple_1", "101"),
    "thermocouple_2": ChannelRole("thermocouple_2", "102"),
    # Wariant A (osobne kanały):
    "voltage_probe": ChannelRole("voltage_probe", "103"),
    # Wariant B (te same kanały co termopary) — po prostu
    # CHANNEL_MAP["thermocouple_1"].address w innym trybie funkcji SENSe
}