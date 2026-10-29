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
import type { Device } from "@/models/device/device.ts"
import { Outlet, useMatches } from "react-router-dom"
import {Fragment, useCallback} from "react"
import {Play, Square} from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

interface SidebarProps {
    setSelectedDevice: (device: Device) => void
    getDevices: () => Promise<Device[]>
    deleteDevice: (hash: string) => Promise<void>
    handleNavigateToDevice: (variant: "inspect" | "edit" | "add", hash?: string) => void
    handleNavigateToDashboard: () => void;
    handleNavigateToDataTable: () => void;
    handleNavigateToFittingsSettings: () => void;
    handleNavigateToFittingsDashboard: () => void;

    getDeviceConnectionStatus: () => boolean | null;

    handleOnStart: () => Promise<void>
    handleOnStop: () => Promise<void>

    showDQQSControlPanel: () => boolean
}

const Sidebar = observer((props: SidebarProps) => {
    const { getDevices, deleteDevice, handleNavigateToDevice, getDeviceConnectionStatus,
        handleNavigateToDashboard, handleNavigateToDataTable, handleNavigateToFittingsSettings,
        handleNavigateToFittingsDashboard, setSelectedDevice, handleOnStart, handleOnStop,
        showDQQSControlPanel } = props

    return (
        <SidebarProvider>
            <AppSidebar
                variant="inset"
                setSelectedDevice={setSelectedDevice}
                getDevices={getDevices}
                deleteDevice={deleteDevice}
                handleNavigateToDevice={handleNavigateToDevice}
                handleNavigateToDashboard={handleNavigateToDashboard}
                handleNavigateToDataTable={handleNavigateToDataTable}
                handleNavigateToFittingsSettings={handleNavigateToFittingsSettings}
                handleNavigateToFittingsDashboard={handleNavigateToFittingsDashboard}
                getDeviceConnectionStatus={getDeviceConnectionStatus}
            />
            <Inset
                handleOnStop={handleOnStop}
                handleOnStart={handleOnStart}
                showDQQSControlPanel={showDQQSControlPanel}
            />
        </SidebarProvider>
    )
})

const Inset = observer((
    props: {
        handleOnStart: () => Promise<void>
        handleOnStop: () => Promise<void>
        showDQQSControlPanel: () => boolean
    }
) => {
    const {handleOnStart, handleOnStop, showDQQSControlPanel} = props;
    const matches = useMatches()

    const crumbs = matches
        .filter((m) => Boolean((m.handle as any)?.crumb))
        .map((m) => (m.handle as any).crumb(m))

    return (
        <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear">
                <div className="flex min-w-0 items-center gap-2 px-4">
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

                {showDQQSControlPanel() && (
                    <div className="ml-auto px-4">
                        <ControlPanel
                            handleOnStart={handleOnStart}
                            handleOnStop={handleOnStop}
                        />
                    </div>
                )}
            </header>
            <Separator orientation="horizontal"/>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <Outlet />
            </div>
        </SidebarInset>
    )
})


const ControlPanel = observer(
    (props: {
        handleOnStart: () => Promise<void>;
        handleOnStop: () => Promise<void>;
    }) => {
        const { handleOnStart, handleOnStop } = props;

        const handleValueChange = async (value: string) => {
            if (value === "start") {
                await handleOnStart();
            }

            if (value === "stop") {
                await handleOnStop();
            }
        };

        return (
            <ToggleGroup
                type="single"
                onValueChange={handleValueChange}
                className="inline-flex items-center gap-0.5 rounded-lg border border-border/60 bg-background/80 p-0.5 shadow-sm backdrop-blur-xl"
            >
                <ToggleGroupItem
                    value="start"
                    title="Start"
                    aria-label="Start"
                    className="h-7 w-7 rounded-md"
                >
                    <Play
                        className="h-3.5 w-3.5"
                    />
                </ToggleGroupItem>

                <ToggleGroupItem
                    value="stop"
                    title="Stop"
                    aria-label="Stop"
                    className="h-7 w-7 rounded-md"
                >
                    <Square
                        className="h-3.5 w-3.5"
                    />
                </ToggleGroupItem>
            </ToggleGroup>
        );
    }
);


export default Sidebar