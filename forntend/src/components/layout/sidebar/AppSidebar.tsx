"use client"

import { Sidebar, SidebarHeader } from "@/components/ui/sidebar"
import { observer } from "mobx-react-lite"
import type { Device } from "@/models/device/device.ts"
import DeviceSwitcher from "@/components/layout/sidebar/DeviceSwitcher.tsx"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
    getDevices: () => Device[]
    deleteDevice: (resourceAddress: string) => void
    handleNavigateToDevice: (variant: "inspect" | "edit" | "add", deviceName?: string, deviceId?: string) => void
}

const AppSidebar = observer((props: AppSidebarProps) => {
    const { getDevices, deleteDevice, handleNavigateToDevice, ...sidebarProps } = props

    return (
        <Sidebar collapsible="offcanvas" {...sidebarProps}>
            <SidebarHeader>
                <DeviceSwitcher
                    getDevices={getDevices}
                    deleteDevice={deleteDevice}
                    getDeviceConnectionStatus={() => true}
                    handleNavigateToDevice={handleNavigateToDevice}
                />
            </SidebarHeader>
        </Sidebar>
    )
})

export default AppSidebar