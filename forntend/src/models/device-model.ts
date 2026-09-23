import { LogoMap } from "@/models/logo-map.ts";

export type LogoKey = keyof typeof LogoMap;

export interface DeviceModel {
    name: string;
    logo: LogoKey;
    resourceAddress: string;
    thermocouple_1_slot: string;
    thermocouple_1_channel: string;
    thermocouple_2_slot: string;
    thermocouple_2_channel: string;
    voltage_slot: string;
    voltage_channel: string;
}

export type StoredDevice = DeviceModel;