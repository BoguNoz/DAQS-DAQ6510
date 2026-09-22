import {observer} from "mobx-react-lite";
import Sidebar from "@/components/layout/sidebar/Sidebar.tsx";
import type {DeviceModel} from "@/models/device-model.ts";
import * as React from "react";
import {deviceStorage} from "@/helpers/device-storage.ts";
import {AudioWaveform, Command, GalleryVerticalEnd} from "lucide-react";
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
                logo: GalleryVerticalEnd,
                resourceAddress: "acme-inc",
            },
            {
                name: "Acme Corp.",
                logo: AudioWaveform,
                resourceAddress: "acme-corp",
            },
            {
                name: "Evil Corp.",
                logo: Command,
                resourceAddress: "evil-corp",
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