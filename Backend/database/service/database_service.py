from typing import List

from sqlalchemy.orm import Session

from database.domain.models.device import Device
from database.domain.models.measurement import Measurement, DeviceL
from database.infrastructure.models.device import DeviceORM
from database.infrastructure.models.measurement import MeasurementORM
from database.infrastructure.repositories.device_repository import DeviceRepository
from database.infrastructure.repositories.measurement_repository import MeasurementRepository
from database.utils.hasher import Hasher


class DatabaseService:

    def __init__(self, session: Session):
        self._session = session
        self._device_repository = DeviceRepository(session)
        self._measurement_repository = MeasurementRepository(session)
        self._hasher = Hasher()

    def get_device(self, device_hash: str) -> Device:
        id_ = self._hasher.decode(device_hash)
        result = self._device_repository.get_by_id(id_)
        return self._device_to_model(result)

    def get_all_devices(self) -> List[Device]:
        result = self._device_repository.get_all()
        return [self._device_to_model(device) for device in result]

    def add_new_device(self, device: Device) -> str:
        orm = self._device_to_orm(device, is_new=True)
        created_id = self._device_repository.create(orm)
        return self._hasher.encode(created_id)

    def update_device(self, device: Device) -> str:
        orm = self._device_to_orm(device, is_new=False)
        updated_id = self._device_repository.update(orm)
        return self._hasher.encode(updated_id)
    def delete_device(self, device_hash: str) -> bool:
        id_ = self._hasher.decode(device_hash)
        result = self._device_repository.delete(id_)
        return result

    def add_new_measurement(self, measurement: Measurement) -> str:
        orm = MeasurementORM(
            device_id=self._hasher.decode(measurement.device.hash),
            time=measurement.time,
            t1=measurement.t1,
            t2=measurement.t2,
            voltage=measurement.voltage,
        )
        result = self._measurement_repository.create(orm)
        return self._hasher.encode(result)

    def list_measurements(
            self,
            filters: list[dict],
            page_index: int,
            page_size: int,
    ) -> tuple[list[Measurement], int]:
        if "device" in filters and filters["device"]:
            filters["device"] = self._hasher.decode(filters["device"])

        if page_size > 50:
            page_size = 50

        orms, total = self._measurement_repository.get_all(filters, page_index, page_size)

        result = []

        for orm in orms:
            device = self.get_device(orm.device_id)

            result.append(Measurement(
                hash=self._hasher.encode(orm.id),
                device=DeviceL(
                    hash=device.hash,
                    logo=device.logo,
                    name=device.name,
                ),
                time=orm.time,
                t1=orm.t1,
                t2=orm.t2,
                voltage=orm.voltage,
            ))

        return result, total


    def _device_to_model(self, orm: DeviceORM) -> Device:
        return Device(
            hash=self._hasher.encode(orm.id),
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

    def _device_to_orm(self, device: Device, is_new: bool = False) -> DeviceORM:
        orm = DeviceORM(
            name=device.name,
            logo=device.logo,
            resource_address=device.resource_address,
            thermocouple_1_slot=device.thermocouple_1_slot,
            thermocouple_1_channel=device.thermocouple_1_channel,
            thermocouple_2_slot=device.thermocouple_2_slot,
            thermocouple_2_channel=device.thermocouple_2_channel,
            voltage_slot=device.voltage_slot,
            voltage_channel=device.voltage_channel,
        )

        if not is_new:
            orm.id = self._hasher.decode(device.hash)

        return orm



