
import json
from pathlib import Path
from dataclasses import dataclass

CONFIG_PATH = Path(__file__).parent / "channel_config.json"
CONNECTION_CONFIG_PATH = Path(__file__).parent / "connection_config.json"

@dataclass(frozen=True)
class ChannelRole:
    name: str
    address: str  # zbudowany z slot+channel, np. "101"

def load_channel_map() -> dict[str, ChannelRole]:
    with open(CONFIG_PATH) as f:
        raw = json.load(f)

    return {
        name: ChannelRole(name, address=f"{data['slot']}{data['channel']:02d}")
        for name, data in raw.items()
    }

def save_channel_map(raw_config: dict) -> None:
    # TODO: walidacja przed zapisem — sprawdź, że są dokładnie 3 wymagane klucze,
    # że slot/channel to sensowne liczby całkowite (patrz sekcja niżej)
    with open(CONFIG_PATH, "w") as f:
        json.dump(raw_config, f, indent=2)

def load_connection_config() -> dict:
    with open(CONNECTION_CONFIG_PATH) as f:
        return json.load(f)

def save_connection_config(config: dict) -> None:
    with open(CONNECTION_CONFIG_PATH, "w") as f:
        json.dump(config, f, indent=2)

KALMAN_PROCESS_VARIANCE = 1e-5   # TODO: skalibruj na realnych/symulowanych danych
KALMAN_MEASUREMENT_VARIANCE = 1e-2  # TODO: skalibruj na realnych/symulowanych danych