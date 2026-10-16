"use client"

import {Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenuButton} from "@/components/ui/sidebar"
import { observer } from "mobx-react-lite"
import type { Device } from "@/models/device/device.ts"
import DeviceSwitcher from "@/components/layout/sidebar/DeviceSwitcher.tsx"
import type {ComponentProps} from "react";
import {ChartLine, Table} from "lucide-react";
import {en} from "@/text/en.ts";

interface AppSidebarProps extends ComponentProps<typeof Sidebar> {
    setSelectedDevice: (device: Device) => void
    getDevices: () => Promise<Device[]>
    deleteDevice: (hash: string) => Promise<void>
    handleNavigateToDevice: (variant: "inspect" | "edit" | "add", deviceName?: string, hash?: string) => void
    handleNavigateToDashboard: () => void;
    handleNavigateToDataTable: () => void;
    getDeviceConnectionStatus: () => boolean | null;
}


const AppSidebar = observer((props: AppSidebarProps) => {
    const { getDevices, deleteDevice, handleNavigateToDevice, getDeviceConnectionStatus, handleNavigateToDashboard, handleNavigateToDataTable, setSelectedDevice, ...sidebarProps } = props

    return (
        <Sidebar collapsible="offcanvas" {...sidebarProps}>
            <SidebarHeader>
                <DeviceSwitcher
                    setSelectedDevice={setSelectedDevice}
                    getDevices={getDevices}
                    deleteDevice={deleteDevice}
                    getDeviceConnectionStatus={getDeviceConnectionStatus}
                    handleNavigateToDevice={handleNavigateToDevice}
                />
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent className="pl-2 flex flex-col gap-2 font-light">
                        <SidebarMenuButton onClick={handleNavigateToDashboard}>
                            <ChartLine/>
                            <span>{en.sidebarTabs.dashboardPage}</span>
                        </SidebarMenuButton>
                        <SidebarMenuButton onClick={handleNavigateToDataTable} >
                            <Table/>
                            <span>{en.sidebarTabs.experimentData}</span>
                        </SidebarMenuButton>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
})

export default AppSidebar