import {observer} from "mobx-react-lite";
import type {DeviceModel} from "@/models/device-model.ts";
import * as React from "react";
import {SidebarMenu, SidebarMenuButton, SidebarMenuItem} from "@/components/ui/sidebar.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {ChevronsUpDown, Plus, TrashIcon} from "lucide-react";
import {en} from "@/text/en.ts";
import {Marker, MarkerContent, MarkerIcon} from "@/components/ui/marker.tsx";
import {Spinner} from "@/components/ui/spinner.tsx";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuGroup,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuShortcut,
    ContextMenuTrigger
} from "@/components/ui/context-menu.tsx";



interface DeviceSwitcherProps {
    getDevices: () => DeviceModel[];
    deleteDevice: (resourceAddress: string) => void;
    getDeviceConnectionStatus: (resourceAddress: string) => boolean | null;
}

const DeviceSwitcher = observer((props: DeviceSwitcherProps) => {
    const {getDevices, deleteDevice, getDeviceConnectionStatus} = props;

    const [devices, setDevices] = React.useState<DeviceModel[]>(() => getDevices());

    const [activeDevice, setActiveDevice] = React.useState<DeviceModel>(
        devices[0]
    );

    const handleDeleteDevice = (resourceAddress: string) => {
        deleteDevice(resourceAddress);

        const updatedDevices = getDevices();
        setDevices(updatedDevices);

        if (activeDevice?.resourceAddress === resourceAddress) {
            setActiveDevice(updatedDevices[0]);
        }
    };


    if (!activeDevice) {
        return null;
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <MenuTrigger
                        device={activeDevice}
                        getDeviceConnectionStatus={getDeviceConnectionStatus}
                    />
                    <MenuContent
                        devices={devices}
                        setActiveDevice={setActiveDevice}
                        deleteDevice={handleDeleteDevice}
                    />
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
});


const MenuTrigger = observer((
    props: {
        device: DeviceModel
        getDeviceConnectionStatus: (resourceAddress: string) => boolean | null;
    }
) => {
    const {device} = props;

    return (
        <DropdownMenuTrigger asChild>
            <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <device.logo className="size-4" />
                </div>
               <ConnectionState
                   device={device}
                   getDeviceConnectionStatus={props.getDeviceConnectionStatus}
               />
                <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
        </DropdownMenuTrigger>
    )
});


const ConnectionState = observer((
    props: {
        device: DeviceModel
        getDeviceConnectionStatus: (resourceAddress: string) => boolean | null;
    }
) => {
    const {device} = props;
    const [deviceState, setDeviceState] = React.useState(null);

   // TODO STAE MENAGEMENT
    
    return (
        <Marker role="status">
            <MarkerIcon>
                <Spinner />
            </MarkerIcon>
            <MarkerContent className="shimmer">{device.name}</MarkerContent>
        </Marker>
    );
});


const MenuContent = observer((
    props: {
        devices: DeviceModel[],
        setActiveDevice:React.Dispatch<React.SetStateAction<DeviceModel>>
        deleteDevice: (resourceAddress: string) => void;
    }
) => {

    const {devices, setActiveDevice, deleteDevice} = props;

    return (
        <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            sideOffset={4}
        >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
                {en.deviceSwitcher.menuContentLabel}
            </DropdownMenuLabel>
            {devices.map((device, index) => (
                <ContextMenu key={index}>
                    <ContextMenuTrigger>
                        <MenuItem
                            key={index}
                            index={index}
                            device={device}
                            setActiveDevice={setActiveDevice}
                        />
                    </ContextMenuTrigger>
                    <ItemContextMenu
                        device={device}
                        deleteDevice={deleteDevice}
                        setActiveDevice={setActiveDevice}
                    />
                </ContextMenu>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                    <Plus className="size-4" />
                </div>
                <div className="font-medium text-muted-foreground">Add team</div>
            </DropdownMenuItem>
        </DropdownMenuContent>
    );
});

const MenuItem = observer((
    props: {
        index: number;
        device: DeviceModel,
        setActiveDevice: React.Dispatch<React.SetStateAction<DeviceModel>>}
) => {
    const {index, device, setActiveDevice} = props;

    return (
        <DropdownMenuItem
            key={device.name}
            onClick={() => setActiveDevice(device)}
            className="gap-2 p-2"
        >
            <div className="flex size-6 items-center justify-center rounded-md border">
                <device.logo className="size-3.5 shrink-0" />
            </div>
            {device.name}
            <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
        </DropdownMenuItem>
    );
});

const ItemContextMenu = observer((
    props: {
        device: DeviceModel,
        setActiveDevice: React.Dispatch<React.SetStateAction<DeviceModel>>
        deleteDevice: (resourceAddress: string) => void;
    }
) => {
    const {device, setActiveDevice, deleteDevice} = props;

    return (
        <ContextMenuContent className="w-48">
            <ContextMenuGroup>
                <ContextMenuItem onClick={() => setActiveDevice(device)}>
                    Select
                    <ContextMenuShortcut>⌘[</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuGroup onClick={() => deleteDevice(device.resourceAddress)}>
                    <ContextMenuItem variant="destructive">
                        <TrashIcon />
                        Delete
                    </ContextMenuItem>
                </ContextMenuGroup>
            </ContextMenuGroup>
        </ContextMenuContent>
    );
});


export default DeviceSwitcher;