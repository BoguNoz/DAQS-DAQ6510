import {observer} from "mobx-react-lite";
import Sidebar from "@/components/layout/sidebar/Sidebar.tsx";
import type {Device} from "@/models/device/device.ts";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import {useCallback, useEffect} from "react";
import {roots} from "@/roots/root.tsx";
import type {DataStoreInterface} from "@/stores/data-store.ts";
import {toast} from "sonner";
import {en} from "@/text/en.ts";


interface SidebarContainerProps {
    dataStore: DataStoreInterface;
}

const SidebarContainer = observer((props: SidebarContainerProps) => {
    const { dataStore } = props;

    const navigate = useNavigate();

    useEffect(() => dataStore.startPollingDeviceStatus(), [dataStore]);

    const getDevices = React.useCallback(async (): Promise<Device[]>  => {
        const stored =  await dataStore.getAllDevices()


        // TODO Do usunięcia
        const defaults: Device[] = [
            {
                hash: "test",
                name: "Acme Inc",
                logo: "radio",
                resource_address: "acme-inc",
                thermocouple_1_slot: "1",
                thermocouple_1_channel: "101",
                thermocouple_2_slot: "1",
                thermocouple_2_channel: "102",
                voltage_slot: "2",
                voltage_channel: "101",
            },
            {
                hash: "test",
                name: "Acme Corp.",
                logo: "router",
                resource_address: "acme-corp",
                thermocouple_1_slot: "1",
                thermocouple_1_channel: "201",
                thermocouple_2_slot: "1",
                thermocouple_2_channel: "202",
                voltage_slot: "2",
                voltage_channel: "201",
            },
            {
                hash: "test",
                name: "Evil Corp.",
                logo: "cpu",
                resource_address: "evil-corp",
                thermocouple_1_slot: "1",
                thermocouple_1_channel: "301",
                thermocouple_2_slot: "1",
                thermocouple_2_channel: "302",
                voltage_slot: "2",
                voltage_channel: "301",
            },
        ];

        return stored;
    }, [dataStore]);

    const setSelectedDevice = useCallback((device: Device) => {
        dataStore.setDevice(device);
    }, [dataStore]);

    const deleteDevice = useCallback(async (hash: string) => {
        try {
            await dataStore.deleteDevice(hash);
        } catch {
            toast.error(en.toast.deviceDeleteFailed);
        }
    }, [dataStore]);

    const handleNavigateToDevice = useCallback((variant: "inspect" | "edit" | "add", deviceName?: string, deviceId?: string) => {
        if (variant === "add") {
            navigate(`/${roots.device}/${variant}`);
        } else {
            navigate(`/${roots.device}/${variant}/${deviceName}/${deviceId}`);
        }
    }, [navigate]);

    const handleNavigateToDashboard = useCallback(() => navigate(`/${roots.dashboard}`),[navigate]);

    const handleNavigateToDataTable = useCallback(() => navigate(`/${roots.dataTable}`),[navigate]);

    const handleOnStart = useCallback(async () => await dataStore.startExperiment(), [dataStore]);
    const handleOnStop = useCallback(async () => await dataStore.stopExperiment(), [dataStore])

    return (
        <Sidebar
            setSelectedDevice={setSelectedDevice}
            getDevices={getDevices}
            deleteDevice={deleteDevice}
            handleNavigateToDevice={handleNavigateToDevice}
            handleNavigateToDashboard={handleNavigateToDashboard}
            handleNavigateToDataTable={handleNavigateToDataTable}
            getDeviceConnectionStatus={dataStore.getStatus}
            handleOnStart={handleOnStart}
            handleOnStop={handleOnStop}
        />
    );
});

export default SidebarContainer;