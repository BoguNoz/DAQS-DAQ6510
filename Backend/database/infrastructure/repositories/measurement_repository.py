from sqlalchemy.orm import Session
from sqlalchemy import select, func, and_
from database.domain.models.measurement import Measurement
from database.infrastructure.models.measurement import MeasurementORM

class MeasurementRepository:
    def __init__(self, session: Session):
        self.session = session

    def create(self, model: Measurement) -> None:
        orm = MeasurementORM(
            device_id=model.device_id,
            time=model.time,
            t1=model.t1,
            t2=model.t2,
            voltage=model.voltage,
        )
        self.session.add(orm)
        self.session.commit()

    def list(
        self,
        filters: list[dict],
        page_index: int,
        page_size: int,
    ) -> tuple[list[Measurement], int]:
        stmt = select(MeasurementORM)
        count_stmt = select(func.count()).select_from(MeasurementORM)

        conditions = self._build_conditions(filters)
        if conditions:
            stmt = stmt.where(and_(*conditions))
            count_stmt = count_stmt.where(and_(*conditions))

        total = self.session.scalar(count_stmt) or 0

        stmt = (
            stmt
            .order_by(MeasurementORM.time.desc())
            .offset(page_index * page_size)
            .limit(page_size)
        )
        rows = self.session.scalars(stmt).all()

        result = [
            Measurement(
                id=row.id,
                device_id=row.device_id,
                time=row.time,
                t1=row.t1,
                t2=row.t2,
                voltage=row.voltage,
            )
            for row in rows
        ]
        return result, total

    def _build_conditions(self, filters: list[dict]) -> list:
        conditions = []

        for f in filters:
            field_id = f.get("id")
            value = f.get("value")

            if field_id == "time" and value:
                if value.get("from"):
                    conditions.append(MeasurementORM.time >= value["from"])
                if value.get("to"):
                    conditions.append(MeasurementORM.time <= value["to"])

            elif field_id == "device" and value:
                conditions.append(MeasurementORM.device_id == value)

            elif field_id == "t1" and value:
                if value.get("min") is not None:
                    conditions.append(MeasurementORM.t1 >= value["min"])
                if value.get("max") is not None:
                    conditions.append(MeasurementORM.t1 <= value["max"])

            elif field_id == "t2" and value:
                if value.get("min") is not None:
                    conditions.append(MeasurementORM.t2 >= value["min"])
                if value.get("max") is not None:
                    conditions.append(MeasurementORM.t2 <= value["max"])

            elif field_id == "voltage" and value:
                if value.get("min") is not None:
                    conditions.append(MeasurementORM.voltage >= value["min"])
                if value.get("max") is not None:
                    conditions.append(MeasurementORM.voltage <= value["max"])

        return conditions

