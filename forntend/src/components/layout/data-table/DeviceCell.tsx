import {observer} from "mobx-react-lite";
import {Marker, MarkerContent, MarkerIcon} from "@/components/ui/marker.tsx";
import {LogoMap} from "@/models/logo-map.ts";
import {GalleryVerticalEnd} from "lucide-react";
import type {LogoKey} from "@/models/device-model.ts";

interface DeviceCellProps {
    name: string
    logo: LogoKey,
}

const DeviceCell = observer((props: DeviceCellProps) => {
    const {name, logo} = props;

    const IconComponent = LogoMap[logo] || GalleryVerticalEnd;

    return (
        <Marker>
            <MarkerIcon>
                <IconComponent/>
            </MarkerIcon>
            <MarkerContent>{name}</MarkerContent>
        </Marker>
    );
});

export default DeviceCell;