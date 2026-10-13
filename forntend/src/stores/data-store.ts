import {experimentService} from "@/services/experiment-service.ts";
import {databaseService} from "@/services/database-service.ts";
import type {Device} from "@/models/device/device.ts";
import type {MeasurementFilter} from "@/models/measurement/measurement-filter.ts";
import type {MeasurementsPage} from "@/models/measurement/measurements-page.ts";
import type {ExperimentHistory} from "@/models/experiment/experiment-history.ts";
import type {ExperimentChannelMap} from "@/models/experiment/experiment-channel-map.ts";
import type {ExperimentConnectionConfig} from "@/models/experiment/experiment-connection-config.ts";
import type {ExperimentStatus} from "@/models/experiment/experiment-status.ts";
import {action, makeObservable, observable} from "mobx";

export interface DataStoreInterface {

    getT1Series: () => number[];
    getT2Series: () => number[];
    getVoltageSeries: () => number[];

    getExperimentStatus: () => ExperimentStatus | null;
    startListeningExperimentStatus: () => () => void;

    startExperiment: () => Promise<void>;
    stopExperiment: () => Promise<void>;
    getExperimentHistory: () => Promise<void>;


    getStatus: () => boolean | null;
    startPollingDeviceStatus: () => void;

    setDevice: (device: Device) => void;
    getDevice: (deviceHash: string) => Promise<Device>;
    getAllDevices: () => Promise<Device[]>;
    addDevice: (device: Device) => Promise<string>;
    updateDevice: (device: Device) => Promise<string>;
    deleteDevice: (deviceHash: string) => void;
    listMeasurements: (
        filters: MeasurementFilter[],
        pageIndex: number,
        pageSize: number,
    ) => Promise<MeasurementsPage>;

}

const POLL_INTERVAL_MS = 5_000;

class DataStore implements DataStoreInterface {

    _experimentStatus: ExperimentStatus | null = null;
    _t1Series: number[] = [];
    _t2Series: number[] = [];
    _voltageSeries: number[] = [];

    _selectedDevice: Device | null = null;
    _deviceStatus: boolean | null = false;


    constructor() {
        makeObservable(this, {
            _selectedDevice: observable,

            _deviceStatus: observable,
            _setStatus: action,

            _experimentStatus: observable,
            _setExperimentStatus: action,

            _t1Series: observable,
            _t2Series: observable,
            _voltageSeries: observable,
            _setExperimentHistory: action,
        });
    }

    getT1Series = () => this._t1Series;

    getT2Series = () => this._t2Series;

    getVoltageSeries = () => this._voltageSeries;

    _setExperimentHistory = (history: ExperimentHistory) => {
        this._t1Series = history.thermocouple_1_history;
        this._t2Series = history.thermocouple_2_history;
        this._voltageSeries = history.voltage_history;
    };

    _setExperimentStatus = (status: ExperimentStatus) => {
        const previous = this._experimentStatus;
        this._experimentStatus = status;

        const isNewRun =
            (previous?.state === "IDLE" || previous?.state === "DONE") &&
            status.state === "MEASURING_TEMPERATURE";
        if (isNewRun) {
            this._t1Series = [];
            this._t2Series = [];
            this._voltageSeries = [];
        }

        if (status.state === "MEASURING_TEMPERATURE") {
            if (status.thermocouple_1_temperature !== null) {
                this._t1Series = [...this._t1Series, status.thermocouple_1_temperature];

            }
            if (status.thermocouple_2_temperature !== null) {
                this._t2Series = [...this._t2Series, status.thermocouple_2_temperature];

            }

        } else if (status.state === "MEASURING_VOLTAGE" && status.voltage !== null) {
            this._voltageSeries = [...this._voltageSeries, status.voltage];
        }
    };

    getExperimentStatus = () => this._experimentStatus;

    startListeningExperimentStatus = (): (() => void) =>
        experimentService.onStatus(this._setExperimentStatus);

    getExperimentHistory = async () => this._setExperimentHistory(await experimentService.getHistory());



    startExperiment = async () => {
        const channelMap: ExperimentChannelMap = {
            thermocouple_1: {
                slot: this._selectedDevice?.thermocouple_1_slot ?? "1",
                channel: this._selectedDevice?.thermocouple_1_channel ?? "1"
            },
            thermocouple_2: {
                slot: this._selectedDevice?.thermocouple_2_slot ?? "1",
                channel: this._selectedDevice?.thermocouple_2_channel ?? "1"
            },
            voltage_probe: {
                slot: this._selectedDevice?.voltage_slot ?? "1",
                channel: this._selectedDevice?.voltage_channel ?? "1"
            }
        };

        await experimentService.updateChannelMap(channelMap);

        const connectionConfig: ExperimentConnectionConfig = {
            use_simulator: false,
            device_hash: this._selectedDevice?.hash ?? "test",
            resource_address: this._selectedDevice?.resource_address ?? "test",
        }

        await experimentService.updateConnectionConfig(connectionConfig)

        await experimentService.start()

    }

    stopExperiment = async () => await experimentService.stop()


    _setStatus = (status: boolean | null) => {
        this._deviceStatus = status;
    };

    getStatus = (): boolean | null => this._deviceStatus;

    startPollingDeviceStatus = () => {
        let stopped = false;
        let timer: ReturnType<typeof setTimeout>;

        this._setStatus(null);

        const tick = async () => {
            if (stopped) return;


            try {
                const connected = await experimentService.getDeviceStatus();
                if (!stopped) this._setStatus(connected);
            } catch {
                if (!stopped) this._setStatus(false);
            }


            if (!stopped) {
                timer = setTimeout(tick, POLL_INTERVAL_MS);
            }
        };

        void tick();

        return () => {
            stopped = true;
            clearTimeout(timer);
        };
    }



    setDevice = (device: Device) => this._selectedDevice = device;

    getDevice = async (deviceHash: string) => await  databaseService.getDevice(deviceHash);

    getAllDevices = async () => await databaseService.getAllDevices();

    addDevice = async (device: Device) => await databaseService.addNewDevice(device);

    updateDevice = async (device: Device) => await databaseService.updateDevice(device);

    deleteDevice = async (deviceHash: string) => await databaseService.deleteDevice(deviceHash);

    listMeasurements = async (
            filters: MeasurementFilter[],
            pageIndex: number,
            pageSize: number
        ) => await databaseService.listMeasurements(filters, pageIndex, pageSize);

}

export const dataStore = new DataStore();