import {observer} from "mobx-react-lite";
import {Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend} from "@/components/ui/field.tsx";
import {en} from "@/text/en.ts";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {ChevronsUpDown, GalleryVerticalEnd} from "lucide-react";
import * as React from "react";
import {Input} from "@/components/ui/input.tsx";
import {LogoMap} from "@/models/logo-map.ts";

const DevicePage = observer(() => {
    const [logo, setLogo] = React.useState<React.ElementType>(GalleryVerticalEnd);

    return (
        <div className="flex min-h-screen items-center justify-center">
            <form className="w-full max-w-lg">
                <FieldGroup>
                    <FieldLegend>
                        {en.devicePage.title}
                    </FieldLegend>
                    <FieldDescription>
                        {en.devicePage.description}
                    </FieldDescription>
                    <NameRaw
                        logo={logo}
                        setLogo={setLogo}
                    />
                    <FieldGroup>
                        <Field>
                            <FieldLabel>
                                {en.devicePage.resourceAddress}
                            </FieldLabel>
                            <Input
                                placeholder="USB0::0x05E6::0x6510::12345678::0::INSTR"
                                required
                            />
                        </Field>
                        <Field>
                            <FieldLabel>
                                {en.devicePage.resourceAddress}
                            </FieldLabel>
                            <Input
                                placeholder="USB0::0x05E6::0x6510::12345678::0::INSTR"
                                required
                            />
                        </Field>
                    </FieldGroup>
                </FieldGroup>
            </form>
        </div>
    );
});

const DeviceNameSection = observer(() => {

});

const NameRaw = observer((
    props: {
        logo: React.ElementType
        setLogo: React.Dispatch<React.SetStateAction<React.ElementType<any, keyof React.JSX.IntrinsicElements>>>
    }
) => {


    return (
        <div className="grid grid-cols-4 gap-4">
            <Field className="col-span-1">
                <FieldLabel htmlFor="icon">
                    {en.devicePage.iconLabel}
                </FieldLabel>

                <DropdownMenu>
                    <DropdownMenuTrigger
                        className="flex items-center gap-2 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    >
                        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                            <props.logo className="size-4" />
                        </div>

                        <ChevronsUpDown className="size-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-0 rounded-lg"
                        align="start"
                        sideOffset={4}
                    >
                        {Object.entries(LogoMap).map(([key, Logo]) => (
                            <DropdownMenuItem key={key} onClick={() => props.setLogo(Logo)}>
                                <Logo className="size-4" />
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </Field>

            <Field className="col-span-3">
                <FieldLabel htmlFor="name">
                    {en.devicePage.nameLabel}
                </FieldLabel>

                <Input
                    id="name"
                    placeholder="DAQ6510"
                    required
                />
            </Field>
        </div>
    );
});

export default DevicePage;