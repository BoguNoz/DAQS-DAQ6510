import type {Device, StoredDevice} from "@/models/device/device.ts";

const STORAGE_KEY = "devices";

export const deviceStorage = {
    get(): Device[] {
        const value = localStorage.getItem(STORAGE_KEY);

        if (!value) {
            return [];
        }

        try {
            const devices: StoredDevice[] = JSON.parse(value);
            return devices;
        } catch {
            return [];
        }
    },

    getByAddress(resourceAddress: string): Device | undefined {
        const devices = this.get();
        return devices.find(device => device.resource_address === resourceAddress);
    },

    save(device: Device, originalAddress?: string) {
        const devices = this.get();
        const targetAddress = originalAddress || device.resource_address;
        const index = devices.findIndex(d => d.resourceAddress === targetAddress);

        if (index >= 0) {
            devices[index] = device;
        } else {
            devices.push(device);
        }

        this.set(devices);
    },

    remove(resourceAddress: string) {
        const devices = this.get();
        const filteredDevices = devices.filter(
            device => device.resource_address !== resourceAddress
        );
        this.set(filteredDevices);
    },

    set(devices: Device[]) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(devices));
    },

    clear() {
        localStorage.removeItem(STORAGE_KEY);
    },
};