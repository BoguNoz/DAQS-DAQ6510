from database.domain.repositories.measurement_repository import IMeasurementRepository
from database.infrastructure.dtatabase.connection import get_connection
from database.domain.models.measurement import Measurement

_RANGE_FIELDS = {"t1": "m.t1", "t2": "m.t2", "voltage": "m.voltage"}
class MeasurementRepository(IMeasurementRepository):
    def create(self, model: Measurement) -> None:
        conn = get_connection()
        try:
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO measurements (device_id, time, t1, t2, voltage) VALUES (%s, %s, %s, %s, %s)",
                (model.device_id, model.time, model.t1, model.t2, model.voltage),
            )
            conn.commit()
        finally:
            conn.close()

    def list(
            self,
            filters: list[dict],
            page_index: int,
            page_size: int,
    ) -> tuple[list[Measurement], int]:
        where_clauses: list[str] = []
        params: list = []

        where_sql = self._create_where_sql(filters, where_clauses, params)
        conn = get_connection()

        try:
            cursor = conn.cursor(dictionary=True)

            cursor.execute(
                f"""SELECT COUNT(*) AS total
                    FROM measurements m
                    {where_sql}""",
                params,
            )
            total = cursor.fetchone()["total"]

            cursor.execute(
                f"""SELECT m.id , m.time, m.t1, m.t2, m.voltage
                    FROM measurements m
                    {where_sql}
                    ORDER BY m.time DESC
                    LIMIT %s OFFSET %s""",
                params + [page_size, page_index * page_size],
            )
            rows = cursor.fetchall()

            result: list[Measurement] = []
            for row in rows:
                result.append(Measurement(
                    id=row["id"],
                    device_id=row["device_id"],
                    time=row["time"],
                    t1=row["t1"],
                    t2=row["t2"],
                    voltage=row["voltage"],
                ))

            return result, total
        finally:
            conn.close()


    def _create_where_sql(
        self,
        filters: list[dict],
        where_clauses: list[str],
        params: list
    ) -> str:
        for f in filters:
            field_id = f.get("id")
            value = f.get("value")

            if field_id == "time" and value:
                if value.get("from"):
                    where_clauses.append("m.time >= %s")
                    params.append(value["from"])
                if value.get("to"):
                    where_clauses.append("m.time <= %s")
                    params.append(value["to"])

            elif field_id == "device" and value:
                where_clauses.append("d.name = %s")
                params.append(value)

            elif field_id in _RANGE_FIELDS and value:
                column = _RANGE_FIELDS[field_id]
                if value.get("min") is not None:
                    where_clauses.append(f"{column} >= %s")
                    params.append(value["min"])
                if value.get("max") is not None:
                    where_clauses.append(f"{column} <= %s")
                    params.append(value["max"])

        where_sql = f"WHERE {' AND '.join(where_clauses)}" if where_clauses else ""
        return where_sql