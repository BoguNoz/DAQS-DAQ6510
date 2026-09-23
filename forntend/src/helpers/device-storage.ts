import type { DeviceModel } from "@/models/device-model";
import type { StoredDevice } from "@/models/stored-device-model.ts";

const STORAGE_KEY = "devices";

export const deviceStorage = {
    get(): DeviceModel[] {
        const value = localStorage.getItem(STORAGE_KEY);

        if (!value) {
            return [];
        }

        try {
            const devices: StoredDevice[] = JSON.parse(value);
            return devices; // Zwracamy bezpośrednio, bo struktura jest identyczna
        } catch {
            return [];
        }
    },

    remove(resourceAddress: string) {
        const devices = this.get();
        const filteredDevices = devices.filter(
            device => device.resourceAddress !== resourceAddress
        );
        this.set(filteredDevices);
    },

    set(devices: DeviceModel[]) {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(devices)
        );
    },

    clear() {
        localStorage.removeItem(STORAGE_KEY);
    },
};