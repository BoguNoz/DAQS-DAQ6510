from abc import ABC, abstractmethod
from datetime import datetime
from typing import Any

from database.domain.models.measurement import Measurement


class IMeasurementRepository(ABC):

    @abstractmethod
    def create(self, model: Measurement) -> int:
        ...

    @abstractmethod
    def list(
        self,
        filters: list[dict[str, Any]],
        page_index: int,
        page_size: int,
    ) -> tuple[list[dict], int]:
        ...