"use client"

import {Sidebar, SidebarHeader} from "@/components/ui/sidebar";
import {observer} from "mobx-react-lite";
import type {DeviceModel} from "@/models/device-model.ts";
import DeviceSwitcher from "@/components/layout/sidebar/DeviceSwitcher.tsx";

interface AppSidebarProps {
    getDevices: () => DeviceModel[];
    deleteDevice: (resourceAddress: string) => void;
}

const AppSidebar = observer((props: AppSidebarProps) => {
    const {getDevices, deleteDevice} = props;

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <DeviceSwitcher
                    getDevices={getDevices}
                    deleteDevice={deleteDevice}
                    getDeviceConnectionStatus={() => true}
                />
            </SidebarHeader>
        </Sidebar>
    )
});

export default AppSidebar;

