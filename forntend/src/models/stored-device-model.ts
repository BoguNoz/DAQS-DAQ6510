import { LogoMap } from "@/models/logo-map.ts";

export interface StoredDevice {
    name: string;
    logo: keyof typeof LogoMap;
    resourceAddress: string;
}