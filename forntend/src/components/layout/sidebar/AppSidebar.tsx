"use client"

import { Sidebar, SidebarHeader } from "@/components/ui/sidebar"
import { observer } from "mobx-react-lite"
import type { DeviceModel } from "@/models/device-model.ts"
import DeviceSwitcher from "@/components/layout/sidebar/DeviceSwitcher.tsx"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
    getDevices: () => DeviceModel[]
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