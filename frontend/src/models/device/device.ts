import { LogoMap } from "@/models/device/logo-map.ts";

export type LogoKey = keyof typeof LogoMap;

export interface Device {
    hash: string;
    name: string;
    logo: string;
    resource_address: string;
    thermocouple_1_slot: string;
    thermocouple_1_channel: string;
    thermocouple_2_slot: string;
    thermocouple_2_channel: string;
    voltage_slot: string;
    voltage_channel: string;
}

export type StoredDevice = Device;