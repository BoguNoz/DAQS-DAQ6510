"use client"

import { Sidebar, SidebarHeader } from "@/components/ui/sidebar"
import { observer } from "mobx-react-lite"
import type { Device } from "@/models/device/device.ts"
import DeviceSwitcher from "@/components/layout/sidebar/DeviceSwitcher.tsx"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
    setSelectedDevice: (device: Device) => void
    getDevices: () => Promise<Device[]>
    deleteDevice: (hash: string) => Promise<void>
    handleNavigateToDevice: (variant: "inspect" | "edit" | "add", deviceName?: string, hash?: string) => void
    getDeviceConnectionStatus: () => boolean | null;
}

const AppSidebar = observer((props: AppSidebarProps) => {
    const { getDevices, deleteDevice, handleNavigateToDevice, getDeviceConnectionStatus, setSelectedDevice, ...sidebarProps } = props

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
        </Sidebar>
    )
})

export default AppSidebar