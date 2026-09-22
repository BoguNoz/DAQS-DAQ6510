import { observer } from "mobx-react-lite";
import { Field, FieldError, FieldLabel } from "@/components/ui/field.tsx";
import { en } from "@/text/en.ts";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {ChevronsUpDown, GalleryVerticalEnd, Cpu, CheckCircle2, Link} from "lucide-react";
import * as React from "react";
import { Input } from "@/components/ui/input.tsx";
import { LogoMap } from "@/models/logo-map.ts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card.tsx";
import {Controller, type ControllerFieldState, type UseFormReturn} from "react-hook-form";
import * as z from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import {formPrefix} from "@/containers/pages/constants";
import {formFields, type formSchema} from "@/features/device-form.schema.ts";
import {Separator} from "@/components/ui/separator.tsx";


interface DeviceSettingsPageProps {
    form: UseFormReturn<any, any, any>
    onSubmit: (data: z.infer<typeof formSchema>) => void
    variant?: "inspect" | "edit" | "add"
}


const DeviceSettingsPage = observer((props: DeviceSettingsPageProps) => {
    const [logo, setLogo] = React.useState<React.ElementType>(GalleryVerticalEnd);

    const { form, onSubmit, variant } = props;


    return (
        <div className="min-h-screen p-6 flex flex-col pl-10 pr-10">
            <div className="w-full space-y-6 flex flex-col items-start">

                <div className="flex items-center justify-between px-2 w-full">
                    <button
                        type="submit"
                        form={formPrefix}
                        className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 dark:bg-zinc-50 px-4 py-2 text-xs font-semibold text-zinc-50 dark:text-zinc-900 shadow-sm hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
                    >
                        <CheckCircle2 className="size-4" />
                        Zapisz zmiany
                    </button>
                </div>

                <form id={formPrefix} onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                    <fieldset disabled={variant === "inspect"} className="w-full space-y-6 group">

                        <div className="flex flex-col md:flex-row gap-6 w-full">
                            <div className="w-full md:w-4/12">
                                <IdentificationAndAddressing
                                    form={form}
                                    logo={logo}
                                    setLogo={setLogo}
                                />
                            </div>
                            <div className="w-full md:w-8/12">
                                <ChannelMapping
                                    form={form}
                                    disabled={variant === "inspect"}
                                />
                            </div>
                        </div>

                    </fieldset>
                </form>
            </div>
        </div>
    );
});


const IdentificationAndAddressing = observer((
    props: {
        form: UseFormReturn
        logo: React.ElementType
        setLogo: React.Dispatch<React.SetStateAction<React.ElementType<any, keyof React.JSX.IntrinsicElements>>>
    }
) => {
    const {form, logo, setLogo} = props;

    return (
        <Card className="shadow-none bg-transparent">
            <CardHeader className="border-b">
                <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg">
                        <Cpu className="size-4" />
                    </div>
                    <div>
                        <CardTitle className="text-sm font-semibold">{en.devicePage.indSectionTitle}</CardTitle>
                        <CardDescription className="text text-sm">{en.devicePage.indSectionDescription}.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-8">
                <Controller
                    name={formFields.name}
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <NameRaw
                            field={field}
                            fieldState={fieldState}
                            logo={logo}
                            setLogo={setLogo}
                        />
                    )}
                />
                <Controller
                    name={formFields.resourceAddress}
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel
                                className="text-xs font-medium"
                            >
                                {en.devicePage.resourceAddress}
                            </FieldLabel>
                            <div className="flex items-center w-full rounded-md border border-input bg-transparent shadow-2xs focus-within:ring-2 focus-within:ring-ring/20 focus-within:border-primary">
                                <Input
                                    {...field}
                                    placeholder="USB0::0x05E6::..."
                                    required
                                    className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none text-xs font-mono"
                                />
                            </div>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
            </CardContent>
        </Card>
    );
});

const ChannelMapping = observer((
    props: {
        form: UseFormReturn
        disabled: boolean
    }
) => {

    const {form, disabled} = props;

    return (
        <Card className="shadow-none bg-transparent">
            <CardHeader className="border-b">
                <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg">
                        <Link className="size-4" />
                    </div>
                    <div>
                        <CardTitle className="text-sm font-semibold">{en.devicePage.chanelMappingTitle}</CardTitle>
                        <CardDescription className="text text-sm">{en.devicePage.chanelMappingDescription}.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-8">
               <SlotChannelRaw
                   form={form}
                   label={en.devicePage.thermocouple_1}
                   slotName={formFields.thermocouple_1_slot}
                   channelName={formFields.thermocouple_1_channel}
                   disabled={disabled}
               />
                <SlotChannelRaw
                    form={form}
                    label={en.devicePage.thermocouple_2}
                    slotName={formFields.thermocouple_2_slot}
                    channelName={formFields.thermocouple_2_channel}
                    disabled={disabled}
                />
                <SlotChannelRaw
                    form={form}
                    label={en.devicePage.voltage}
                    slotName={formFields.voltage_slot}
                    channelName={formFields.voltage_channel}
                    disabled={disabled}
                />

            </CardContent>
        </Card>
    );
});


const SlotChannelRaw = observer((
    props: {
        form: UseFormReturn
        label: string,
        slotName: string,
        channelName: string,
        disabled: boolean
    }
) => {
    const {form, label, slotName, channelName, disabled} = props;

    return (
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 justify-start">
            <label className="text-xs font-medium whitespace-nowrap w-1/5 shrink-0">
                {label}
            </label>

            <Separator orientation={"vertical"} />

            <Controller
                name={slotName}
                control={form.control}
                render={({ field, fieldState }) => (
                    <SlotRaw
                        field={field}
                        fieldState={fieldState}
                        disabled={disabled}
                    />
                )}
            />
            <Controller
                name={channelName}
                control={form.control}
                render={({ field, fieldState }) => (
                    <ChannelRaw
                        field={field}
                        fieldState={fieldState}
                    />
                )}
            />
        </div>
    );
})


const NameRaw = observer((
    props: {
        field: any
        fieldState: ControllerFieldState
        setLogo: React.Dispatch<React.SetStateAction<React.ElementType<any, keyof React.JSX.IntrinsicElements>>>
        logo: React.ElementType
    }
) => {

    const {field, fieldState, setLogo} = props;

    return (
        <Field data-invalid={fieldState.invalid} className="w-full">
            <FieldLabel className="text-xs font-medium">
                {en.devicePage.nameLabel}
            </FieldLabel>

            <div className="flex items-center w-full rounded-md border border-input bg-transparent shadow-2xs focus-within:ring-2 focus-within:ring-ring/20 focus-within:border-primary">
                <DropdownMenu>
                    <DropdownMenuTrigger
                        className="flex items-center gap-1.5 px-3 py-1.5 border-r border-input hover:bg-accent hover:text-accent-foreground rounded-l-md transition-colors outline-none"
                    >
                        <div className="flex aspect-square size-5 items-center justify-center rounded-md bg-primary text-primary-foreground">
                            <props.logo className="size-3" />
                        </div>
                        <ChevronsUpDown className="size-3" />
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        className="w-48 min-w-0 max-h-48 overflow-y-auto rounded-lg p-1 shadow-md [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                        align="start"
                        sideOffset={6}
                    >
                        {Object.entries(LogoMap).map(([key, Logo]) => (
                            <DropdownMenuItem
                                key={key}
                                onClick={() => setLogo(Logo)}
                                className="flex items-center gap-2 cursor-pointer rounded-md px-2 py-1.5 text-xs"
                            >
                                <Logo className="size-3.5" />
                                <span className="capitalize">{key}</span>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                <Input
                    {...field}
                    placeholder="DAQ6510"
                    required
                    className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none text-xs"
                    aria-invalid={props.fieldState.invalid}
                />
            </div>
            {props.fieldState.invalid && <FieldError errors={[props.fieldState.error]} />}
        </Field>
    );
});

const SlotRaw = observer((
    props: {
        field: any
        fieldState: ControllerFieldState
        disabled: boolean
    }
) => {
    const {field, fieldState, disabled} = props;

    return (
        <Field data-invalid={fieldState.invalid} className="w-full" >
            <FieldLabel className="text-xs font-medium w-1/3">
                Slot
            </FieldLabel>
            <Select value={field.value} onValueChange={field.onChange} disabled={disabled}>
                <SelectTrigger className="w-full h-9 text-xs border border-input rounded-md bg-transparent focus-visible:ring-0 focus:border-primary">
                    <SelectValue placeholder="Select"  />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="1">Slot 1</SelectItem>
                    <SelectItem value="2">Slot 2</SelectItem>
                </SelectContent>
            </Select>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
    );
});

const ChannelRaw = observer((
    props: {
        field: any
        fieldState: ControllerFieldState
    }
) => {
    const {field, fieldState} = props;

    return (
        <Field
            data-invalid={fieldState.invalid}
            className="w-full"
        >
            <FieldLabel className="text-xs font-medium">
                Channel
            </FieldLabel>
            <div className="flex items-center w-full rounded-md border border-input bg-transparent shadow-2xs focus-within:ring-2 focus-within:ring-ring/20 focus-within:border-primary">
                <Input
                    {...field}
                    placeholder="np. 1"
                    className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none w-full text-xs h-9" />
            </div>{fieldState.invalid && <FieldError errors={[fieldState.error]} />} </Field>
    );
});

export default DeviceSettingsPage;