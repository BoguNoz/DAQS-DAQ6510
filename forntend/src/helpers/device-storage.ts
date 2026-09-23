import type {DeviceModel, StoredDevice} from "@/models/device-model";

const STORAGE_KEY = "devices";

export const deviceStorage = {
    get(): DeviceModel[] {
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

    getByAddress(resourceAddress: string): DeviceModel | undefined {
        const devices = this.get();
        return devices.find(device => device.resourceAddress === resourceAddress);
    },

    save(device: DeviceModel, originalAddress?: string) {
        const devices = this.get();
        const targetAddress = originalAddress || device.resourceAddress;
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
            device => device.resourceAddress !== resourceAddress
        );
        this.set(filteredDevices);
    },

    set(devices: DeviceModel[]) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(devices));
    },

    clear() {
        localStorage.removeItem(STORAGE_KEY);
    },
};