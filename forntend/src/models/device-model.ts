import { LogoMap } from "@/models/logo-map.ts";

export type LogoKey = keyof typeof LogoMap;

export interface DeviceModel {
    name: string;
    logo: LogoKey;
    resourceAddress: string;
}

export type StoredDevice = DeviceModel;