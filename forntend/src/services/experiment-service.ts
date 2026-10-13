import type { ExperimentHistory } from "@/models/experiment/experiment-history";
import type {ExperimentStatus} from "@/models/experiment/experiment-status.ts";
import type {ExperimentChannelMap} from "@/models/experiment/experiment-channel-map.ts";
import type {ExperimentConnectionConfig} from "@/models/experiment/experiment-connection-config.ts";
import type { WSClient } from "./base-ws-client";
import {wsClient} from "@/services/ws-client.ts";

export interface ExperimentServiceInterface {
    start: () => Promise<void>;
    stop: () => Promise<void>;
    getDeviceStatus: () => Promise<boolean>;
    getHistory: () => Promise<ExperimentHistory>;
    updateChannelMap: (channels: ExperimentChannelMap) => Promise<void>;
    updateConnectionConfig: (connection: ExperimentConnectionConfig) => Promise<void>;
    onStatus: (handler: (state: ExperimentStatus) => void) => () => void;
}

export const ExperimentActions= {
    START: "start",
    STOP: "stop",
    STATUS: "status",
    DEVICE_STATUS: "device_status",
    GET_HISTORY: "get_history",
    UPDATE_CHANNEL_MAP: "update_channel_map",
    UPDATE_CONNECTION_CONFIG: "update_connection_config",
}

class ExperimentService implements ExperimentServiceInterface {
    private readonly client: WSClient;

    constructor(client: WSClient) {
        this.client = client;
    }

    start = async () => { await this.client.request(ExperimentActions.START); };
    stop = async () => { await this.client.request(ExperimentActions.STOP); };

    getDeviceStatus = () => this.client.request<boolean>(ExperimentActions.DEVICE_STATUS);

    // Zapytać się po co mi metoda onStatus to pobierania pomiarów kiedy mam poniższa metodę
    getHistory = () => this.client.request<ExperimentHistory>(ExperimentActions.GET_HISTORY);

    updateChannelMap = async (channels: ExperimentChannelMap) => {
        await this.client.request(ExperimentActions.UPDATE_CHANNEL_MAP, {channels});
    };

    updateConnectionConfig = async (connection: ExperimentConnectionConfig) => {
        await this.client.request(ExperimentActions.UPDATE_CONNECTION_CONFIG, {connection});
    };

    // Brodcast
    onStatus = (handler: (state: ExperimentStatus) => void) =>
        this.client.on<ExperimentStatus>(ExperimentActions.STATUS, handler);

}

export const experimentService = new ExperimentService(wsClient);