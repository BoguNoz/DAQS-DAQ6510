from daq6510.scpi.commands import ScpiCommands
from daq6510.scpi.parser import parse_idn
from daq6510.transport.visa_connection import VisaConnection


class DAQ6510:
    def __init__(self, connection: VisaConnection):
        self._connection = connection

    def connect(self):
        self._connection.open()

    def identify(self) -> dict:
        raw = self._connection.query(ScpiCommands.IDENTIFY)
        return parse_idn(raw)

    def reset(self):
        raw = self._connection.query(ScpiCommands.RESET)

    def set

    def disconnect(self):
        self._connection.close()