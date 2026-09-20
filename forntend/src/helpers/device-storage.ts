import { GalleryVerticalEnd, AudioWaveform, Command } from "lucide-react";
import type { DeviceModel } from "@/models/device-model";
import type {StoredDevice} from "@/models/stored-device-model.ts";
import * as React from "react";
import {LogoMap} from "@/models/logo-map.ts";

const STORAGE_KEY = "devices";


export const deviceStorage = {
    get(): DeviceModel[] {
        const value = localStorage.getItem(STORAGE_KEY);

        if (!value) {
            return [];
        }

        const devices: StoredDevice[] = JSON.parse(value);

        return devices.map(device => ({
            ...device,
            logo: LogoMap[device.logo],
        }));
    },

    remove(resourceAddress: string) {
        const devices = this.get();

        const filteredDevices = devices.filter(
            device => device.resourceAddress !== resourceAddress
        );

        this.set(filteredDevices);
    },

    set(devices: DeviceModel[]) {
        const storedDevices: StoredDevice[] = devices.map(device => ({
            name: device.name,
            resourceAddress: device.resourceAddress,
            logo: getLogoKey(device.logo),
        }));

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(storedDevices)
        );
    },

    clear() {
        localStorage.removeItem(STORAGE_KEY);
    },
};

function getLogoKey(logo: React.ElementType): StoredDevice["logo"] {
    if (logo === GalleryVerticalEnd) {
        return "gallery";
    }

    if (logo === AudioWaveform) {
        return "audio";
    }

    return "command";
}