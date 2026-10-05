from datetime import datetime

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from database.infrastructure.models.base import Base


class MeasurementORM(Base):
    __tablename__ = "measurements"

    id: Mapped[int] = mapped_column(primary_key=True)
    device_id: Mapped[int] = mapped_column(ForeignKey("devices.id"))
    time: Mapped[datetime]
    t1: Mapped[float]
    t2: Mapped[float]
    voltage: Mapped[float]