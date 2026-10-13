import {observer} from "mobx-react-lite";
import type {Device, LogoKey} from "@/models/device/device.ts";
import * as React from "react";
import {SidebarMenu, SidebarMenuButton, SidebarMenuItem} from "@/components/ui/sidebar.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Cable, ChevronsUpDown, GalleryVerticalEnd, GlobeOff, Plus, TrashIcon} from "lucide-react";
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
import { Button } from "@/components/ui/button";
import {LogoMap} from "@/models/device/logo-map.ts";
import {useEffect} from "react";



interface DeviceSwitcherProps {
    setSelectedDevice: (device: Device) => void
    getDevices: () => Promise<Device[]>;
    deleteDevice: (hash: string) => Promise<void>;
    getDeviceConnectionStatus: () => boolean | null;
    handleNavigateToDevice: (variant: "inspect" | "edit" | "add", deviceName?: string, hash?: string) => void
}

const DeviceSwitcher = observer((props: DeviceSwitcherProps) => {
    const {getDevices, deleteDevice, getDeviceConnectionStatus, handleNavigateToDevice, setSelectedDevice} = props;

    const [devices, setDevices] = React.useState<Device[]>([]);
    const [activeDevice, setActiveDevice] = React.useState<Device>(
        devices[0]
    );
    const [reloadKey, setReloadKey] = React.useState(0);

    const handleSetSelectedDevice = (device: Device) => {
        setSelectedDevice(device);
        setActiveDevice(device);
    }

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            const loaded = await getDevices();
            if (cancelled) return;

            setDevices(loaded);
            handleSetSelectedDevice(loaded[0] ?? null);

        };

        void load();

        return () => { cancelled = true; };
    }, [getDevices, reloadKey]);

    const handleDeleteDevice = async (hash: string) => {
        await deleteDevice(hash);
        setReloadKey((key) => key + 1);
    };



    return (
        <SidebarMenu className="rounded-md border border-primary/40">
            <SidebarMenuItem>
                <DropdownMenu>
                    <MenuTrigger
                        device={activeDevice}
                        getDeviceConnectionStatus={getDeviceConnectionStatus}
                    />
                    <MenuContent
                        devices={devices}
                        setSelectedDevice={handleSetSelectedDevice}
                        deleteDevice={handleDeleteDevice}
                        handleNavigateToDevice={handleNavigateToDevice}
                    />
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
});


const MenuTrigger = observer((
    props: {
        device: Device | null;
        getDeviceConnectionStatus: () => boolean | null;
    }
) => {
    const {device} = props;

    const IconComponent = LogoMap[device?.logo as LogoKey] || GalleryVerticalEnd;

    return (
        <DropdownMenuTrigger asChild>
            <SidebarMenuButton
                size="lg"
            >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-white text-gray-900">
                    <IconComponent className="size-4" />
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
        device: Device | null;
        getDeviceConnectionStatus: () => boolean | null;
    }
) => {
    const {device, getDeviceConnectionStatus} = props;
    const status = getDeviceConnectionStatus();

    const getIcon = (status: boolean | null) => {
        if (status === null) {
            return <Spinner/>;
        }
        if (status) {
            return <Cable className="text-green-300"/>;
        }

        return <GlobeOff className="text-red-300"/>;
    }

    return (
        <Marker role="status">
            <MarkerIcon>
                {getIcon(status)}
            </MarkerIcon>
            <MarkerContent
                className={status === null ? "shimmer" : "text-foreground"}
            >
                {device?.name}
            </MarkerContent>
        </Marker>
    );
});


const MenuContent = observer((
    props: {
        devices: Device[],
        setSelectedDevice: (device: Device) => void
        deleteDevice: (hash: string) => void;
        handleNavigateToDevice: (variant: "inspect" | "edit" | "add", deviceName?: string, hash?: string) => void
    }
) => {

    const {devices, setSelectedDevice, deleteDevice, handleNavigateToDevice} = props;

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
                            setSelectedDevice={setSelectedDevice}
                        />
                    </ContextMenuTrigger>
                    <ItemContextMenu
                        device={device}
                        deleteDevice={deleteDevice}
                        setSelectedDevice={setSelectedDevice}
                        handleNavigateToDevice={handleNavigateToDevice}
                    />
                </ContextMenu>
            ))}
            <DropdownMenuSeparator />
            <Button variant="ghost" className="w-full" onClick={() => handleNavigateToDevice("add")}>
                <Plus className="size-4" /> {en.deviceSwitcher.addButtonLabel}
            </Button>
        </DropdownMenuContent>
    );
});

const MenuItem = observer((
    props: {
        index: number;
        device: Device,
        setSelectedDevice: (device: Device) => void;
    }
) => {
    const {index, device, setSelectedDevice} = props;

    const IconComponent = LogoMap[device?.logo as LogoKey] || GalleryVerticalEnd;

    return (
        <DropdownMenuItem
            key={device.name}
            onClick={() => setSelectedDevice(device)}
            className="gap-2 p-2"
        >
            <div className="flex size-6 items-center justify-center rounded-md border">
                <IconComponent className="size-3.5 shrink-0" />
            </div>
            {device.name}
            <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
        </DropdownMenuItem>
    );
});

const ItemContextMenu = observer((
    props: {
        device: Device,
        setSelectedDevice: (device: Device) => void
        deleteDevice: (hash: string) => void;
        handleNavigateToDevice: (variant: "inspect" | "edit" | "add", deviceName?: string, hash?: string) => void
    }
) => {
    const {device, setSelectedDevice, deleteDevice, handleNavigateToDevice} = props;


    return (
        <ContextMenuContent className="w-48">
            <ContextMenuGroup>
                <ContextMenuItem onClick={() => setSelectedDevice(device)}>
                    {en.deviceSwitcher.contextMenu.select}
                    <ContextMenuShortcut>⌘[</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuItem onClick={() => handleNavigateToDevice("edit", device.name, device.hash)}>
                    {en.deviceSwitcher.contextMenu.edit}
                    <ContextMenuShortcut>⌘]</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuItem onClick={() => handleNavigateToDevice("inspect", device.name, device.hash)}>
                    {en.deviceSwitcher.contextMenu.info}
                    <ContextMenuShortcut>⌘i</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuGroup onClick={() => deleteDevice(device.hash)}>
                    <ContextMenuItem variant="destructive">
                        <TrashIcon />
                        {en.deviceSwitcher.contextMenu.delete}
                    </ContextMenuItem>
                </ContextMenuGroup>
            </ContextMenuGroup>
        </ContextMenuContent>
    );
});


export default DeviceSwitcher;