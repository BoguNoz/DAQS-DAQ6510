from sqlalchemy.orm import Session
from sqlalchemy import select, func, and_
from database.domain.models.device import Device
from database.infrastructure.models.device import DeviceORM


class DeviceRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_by_id(self, id: int) -> Device:
        orm = self.session.get(DeviceORM, id)
        if not orm:
            return None
        return self._to_domain(orm)

    def get_all(self) -> list[Device]:
        stmt = select(DeviceORM).order_by(DeviceORM.id)
        rows = self.session.scalars(stmt).all()
        return [self._to_domain(row) for row in rows]

    def create(self, model: Device) -> int:
        orm = DeviceORM(
            name=model.name,
            logo=model.logo,
            resource_address=model.resource_address,
            thermocouple_1_slot=model.thermocouple_1_slot,
            thermocouple_1_channel=model.thermocouple_1_channel,
            thermocouple_2_slot=model.thermocouple_2_slot,
            thermocouple_2_channel=model.thermocouple_2_channel,
            voltage_slot=model.voltage_slot,
            voltage_channel=model.voltage_channel,
        )
        self.session.add(orm)
        self.session.commit()
        self.session.refresh(orm)
        return orm.id

    def update(self, model: Device) -> None:
        orm = self.session.get(DeviceORM, model.id)
        if not orm:
            return None

        orm.name = model.name
        orm.logo = model.logo
        orm.resource_address = model.resource_address
        orm.thermocouple_1_slot = model.thermocouple_1_slot
        orm.thermocouple_1_channel = model.thermocouple_1_channel
        orm.thermocouple_2_slot = model.thermocouple_2_slot
        orm.thermocouple_2_channel = model.thermocouple_2_channel
        orm.voltage_slot = model.voltage_slot
        orm.voltage_channel = model.voltage_channel

        self.session.commit()
        self.session.refresh(orm)

    def delete(self, id: int) -> bool:
        orm = self.session.get(DeviceORM, id)
        if not orm:
            return False

        self.session.delete(orm)
        self.session.commit()
        return True

    def _to_domain(self, orm: DeviceORM) -> Device:
        return Device(
            id=orm.id,
            name=orm.name,
            logo=orm.logo,
            resource_address=orm.resource_address,
            thermocouple_1_slot=orm.thermocouple_1_slot,
            thermocouple_1_channel=orm.thermocouple_1_channel,
            thermocouple_2_slot=orm.thermocouple_2_slot,
            thermocouple_2_channel=orm.thermocouple_2_channel,
            voltage_slot=orm.voltage_slot,
            voltage_channel=orm.voltage_channel,
        )