from dataclasses import dataclass

@dataclass(frozen=True)
class ChannelRole:
    name: str
    address: str

#Format nazewnictwa: SCH
#S — numer slotu (gniazda) na tylnym panelu urządzenia, do którego wpięta jest karta pomiarowa
#CH — dwucyfrowy numer kanału na tej konkretnej karcie.

# TODO: Zapytać do jakich slótw są podpięte karty pomiarowe i o ich numery
CHANNEL_MAP = {
    "thermocouple_1": ChannelRole("thermocouple_1", "101"),
    "thermocouple_2": ChannelRole("thermocouple_2", "102"),
    "voltage_probe": ChannelRole("voltage_probe", "103"),
}