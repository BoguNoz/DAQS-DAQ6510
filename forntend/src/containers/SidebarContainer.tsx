import {observer} from "mobx-react-lite";
import Sidebar from "@/components/layout/sidebar/Sidebar.tsx";
import type {DeviceModel} from "@/models/device-model.ts";
import * as React from "react";
import {deviceStorage} from "@/helpers/device-storage.ts";
import { useNavigate } from "react-router-dom";
import {useCallback} from "react";
import {roots} from "@/roots/root.tsx";


const SidebarContainer = observer(() => {
    const navigate = useNavigate();

    const getDevices = React.useCallback((): DeviceModel[] => {
        const stored = deviceStorage.get();

        if (stored.length > 0) {
            return stored;
        }

        // TODO Do Usunięcia 
        const defaults: DeviceModel[] = [
            {
                name: "Acme Inc",
                logo: "radio",
                resourceAddress: "acme-inc",
                thermocouple_1_slot: "1",
                thermocouple_1_channel: "101",
                thermocouple_2_slot: "1",
                thermocouple_2_channel: "102",
                voltage_slot: "2",
                voltage_channel: "101",
            },
            {
                name: "Acme Corp.",
                logo: "router",
                resourceAddress: "acme-corp",
                thermocouple_1_slot: "1",
                thermocouple_1_channel: "201",
                thermocouple_2_slot: "1",
                thermocouple_2_channel: "202",
                voltage_slot: "2",
                voltage_channel: "201",
            },
            {
                name: "Evil Corp.",
                logo: "cpu",
                resourceAddress: "evil-corp",
                thermocouple_1_slot: "1",
                thermocouple_1_channel: "301",
                thermocouple_2_slot: "1",
                thermocouple_2_channel: "302",
                voltage_slot: "2",
                voltage_channel: "301",
            },
        ];

        deviceStorage.set(defaults);

        return defaults;
    }, []);

    const deleteDevice = React.useCallback((resourceAddress: string) => {
        deviceStorage.remove(resourceAddress);
    }, []);

    const handleNavigateToDevice = useCallback((variant: "inspect" | "edit" | "add", deviceName?: string, deviceId?: string) => {
        if (variant === "add") {
            navigate(`/${roots.device}/${variant}`);
        } else {
            navigate(`/${roots.device}/${variant}/${deviceName}/${deviceId}`);
        }
    }, [navigate]);


    return (
        <Sidebar
            getDevices={getDevices}
            deleteDevice={deleteDevice}
            handleNavigateToDevice={handleNavigateToDevice}
        />
    );
});

export default SidebarContainer;