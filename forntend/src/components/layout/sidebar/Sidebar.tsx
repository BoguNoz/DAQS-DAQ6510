import { observer } from "mobx-react-lite"
import AppSidebar from "@/components/layout/sidebar/AppSidebar.tsx"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar.tsx"
import { Separator } from "@/components/ui/separator.tsx"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb.tsx"
import type { DeviceModel } from "@/models/device-model.ts"
import { Outlet, useMatches } from "react-router-dom"
import { Fragment } from "react"

interface SidebarProps {
    getDevices: () => DeviceModel[]
    deleteDevice: (resourceAddress: string) => void
    handleNavigateToDevice: (variant: "inspect" | "edit" | "add", deviceId?: string) => void
}

const Sidebar = observer((props: SidebarProps) => {
    const { getDevices, deleteDevice, handleNavigateToDevice } = props

    return (
        <SidebarProvider>
            <AppSidebar
                variant="inset"
                getDevices={getDevices}
                deleteDevice={deleteDevice}
                handleNavigateToDevice={handleNavigateToDevice}
            />
            <Inset />
        </SidebarProvider>
    )
})

const Inset = observer(() => {
    const matches = useMatches()

    const crumbs = matches
        .filter((m) => Boolean((m.handle as any)?.crumb))
        .map((m) => (m.handle as any).crumb(m))

    return (
        <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear">
                <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator
                        orientation="vertical"
                        className="mr-2 data-[orientation=vertical]:h-4"
                    />
                    <Breadcrumb>
                        <BreadcrumbList>
                            {crumbs.map((crumb, i) => (
                                <Fragment key={i}>
                                    {i > 0 && <BreadcrumbSeparator className="hidden md:block" />}
                                    <BreadcrumbItem className={i < crumbs.length - 1 ? "hidden md:block" : ""}>
                                        {i === crumbs.length - 1
                                            ? <BreadcrumbPage>{crumb}</BreadcrumbPage>
                                            : <BreadcrumbLink href="#">{crumb}</BreadcrumbLink>}
                                    </BreadcrumbItem>
                                </Fragment>
                            ))}
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>
            <Separator orientation="horizontal"/>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <Outlet />
            </div>
        </SidebarInset>
    )
})

export default Sidebar