import type {MeasurementFilter} from "@/models/measurement/measurement-filter.ts";
import type { MeasurementsPage } from "@/models/measurement/measurements-page";
import type {MeasurementWire} from "@/models/measurement/measurement-wire.ts";
import type {WSClient} from "@/services/base-ws-client.ts";
import {wsClient} from "@/services/ws-client.ts";
import type {Device} from "@/models/device/device.ts";

export const DatabaseActions  = {
    GET_DEVICE: "get_device",
    GET_ALL_DEVICES: "get_all_devices",
    ADD_NEW_DEVICE: "add_new_device",
    UPDATE_DEVICE: "update_device",
    DELETE_DEVICE: "delete_device",
    LIST_MEASUREMENTS: "list_measurements",
}

export interface DatabaseServiceInterface {
    getDevice: (deviceHash: string) => Promise<Device>;
    getAllDevices: () => Promise<Device[]>;
    addNewDevice: (device: Omit<Device, "hash">) => Promise<string>;
    updateDevice: (device: Device) => Promise<string>;
    deleteDevice: (deviceHash: string) => Promise<void>;
    listMeasurements: (
        filters: MeasurementFilter[],
        pageIndex: number,
        pageSize: number,
    ) => Promise<MeasurementsPage>;
}

class DatabaseService implements DatabaseServiceInterface {
    private readonly client: WSClient;

    constructor(client: WSClient) {
        this.client = client;
    }

    getDevice = async (deviceHash: string) => {
        const {device} = await this.client.request<{ device: Device }>(
            DatabaseActions.GET_DEVICE,
            {device_hash: deviceHash},
        );
        return device;
    };

    getAllDevices = async () => {
        const {items} = await this.client.request<{ items: Device[] }>(
            DatabaseActions.GET_ALL_DEVICES,
        );
        return items;
    };

    addNewDevice = async (device: Omit<Device, "hash">) => {
        const {hash} = await this.client.request<{ hash: string }>(
            DatabaseActions.ADD_NEW_DEVICE,
            {device},
        );
        return hash;
    };

    updateDevice = async (device: Device) => {
        const {hash} = await this.client.request<{ hash: string }>(
            DatabaseActions.UPDATE_DEVICE,
            {device},
        );
        return hash;
    };

    deleteDevice = async (deviceHash: string) => {
        await this.client.request(DatabaseActions.DELETE_DEVICE, {device_hash: deviceHash});
    };

    listMeasurements = async (filters: MeasurementFilter[], pageIndex: number, pageSize: number) => {

        const page = await this.client.request<{ items: MeasurementWire[]; total: number }>(
            DatabaseActions.LIST_MEASUREMENTS,
            {filters, page_index: pageIndex, page_size: pageSize},
        );

        return {
            total: page.total,
            items: page.items.map((item) => ({...item, time: new Date(item.time)})),
        };
    };
}

export const databaseService = new DatabaseService(wsClient);