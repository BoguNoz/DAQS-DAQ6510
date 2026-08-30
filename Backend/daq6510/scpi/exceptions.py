class CommandError(Exception):
    """Bazowy wyjątek dla wszystkich błędów obsługi komend."""
    pass

class IdnFormatResponseError(CommandError):
    pass

class ReadingValuesError(CommandError):
    pass

