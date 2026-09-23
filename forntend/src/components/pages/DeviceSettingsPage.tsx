import { observer } from "mobx-react-lite";
import { FieldError, FieldLabel } from "@/components/ui/field.tsx";
import { en } from "@/text/en.ts";
import {Link, Computer, CheckCircle2, CircleX, PlusCircle, Trash2, PencilLine, Undo2} from "lucide-react";
import { Input } from "@/components/ui/input.tsx";
import { LogoMap } from "@/models/logo-map.ts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card.tsx";
import {Controller, type UseFormReturn, useFormState} from "react-hook-form";
import * as z from "zod";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import {formPrefix} from "@/containers/pages/constants";
import {formFields, type formSchema} from "@/features/device-form.schema.ts";
import {Separator} from "@/components/ui/separator.tsx";
import {useEffect, useState} from "react";
import {ButtonGroup} from "@/components/ui/button-group.tsx";
import {Button} from "@/components/ui/button.tsx";



interface DeviceSettingsPageProps {
    form: UseFormReturn<any, any, any>
    onSubmit: (data: z.infer<typeof formSchema>) => void
    handleEditability: (variant?: "inspect" | "edit" | "add") => boolean;
    handleNavigateToDevice: (variant: ("inspect" | "edit" | "add")) => void
    handleDelete: () => void
    variant?: "inspect" | "edit" | "add"
}


const DeviceSettingsPage = observer((props: DeviceSettingsPageProps) => {
    const [disable, setDisable ] = useState(false);

    const { form, onSubmit, variant, handleEditability, handleNavigateToDevice, handleDelete } = props;

    useEffect(() => {
        setDisable(handleEditability(variant))
    }, [handleEditability, variant]);

    return (
        <div className="min-h-screen p-6 flex flex-col pl-10 pr-10">
           <ContextButtons
               variant={variant}
               handleNavigateToDevice={handleNavigateToDevice}
               handleDelete={handleDelete}
               form={form}
           />

            <div className="w-full space-y-6 flex flex-col items-start pt-10">
                <form id={formPrefix} onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                    <fieldset disabled={disable} className="w-full space-y-6 group">
                        <div className="flex flex-col md:flex-row gap-6 w-full">
                            <div className="w-full md:w-5/12">
                                <ChannelMapping
                                    form={form}
                                    disabled={disable}
                                />
                            </div>
                            <div className="w-full md:w-7/12">
                                <DeviceMapping
                                    form={form}
                                />
                            </div>
                        </div>
                    </fieldset>
                </form>
            </div>

        </div>
    );
});


const ContextButtons = observer((
    props: {
        variant?: "inspect" | "edit" | "add"
        handleNavigateToDevice: (variant: ("inspect" | "edit" | "add")) => void
        handleDelete: () => void
        form: UseFormReturn<any, any, any>
    }
) => {
    const {variant, handleNavigateToDevice, handleDelete, form} = props;

    const { isDirty } = useFormState({ control: form.control });

    if (variant === "add") {
        return (
            <ButtonGroup>
                <Button type="submit" form={formPrefix}>
                    <CheckCircle2 />
                    {en.devicePage.buttons.save}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    disabled={!isDirty}
                    onClick={() => form.reset()}
                >
                    <Undo2 className="size-4 mr-2" />
                </Button>
            </ButtonGroup>
        )
    }

    if (variant === "edit") {
        return (
            <ButtonGroup>
                <Button type="submit" form={formPrefix}>
                    <CheckCircle2 />
                    {en.devicePage.buttons.save}
                </Button>
                <Button
                    onClick={() => handleNavigateToDevice("add")}
                    className="bg-[var(--ok-accent)]"
                >
                    <PlusCircle/>
                    {en.devicePage.buttons.add}
                </Button>
                <Button onClick={() => handleDelete()} className="bg-destructive">
                    <Trash2/>
                    {en.devicePage.buttons.delete}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    disabled={!isDirty}
                    onClick={() => form.reset()}
                >
                    <Undo2 className="size-4 mr-2" />
                </Button>
            </ButtonGroup>
        )
    }

    if (variant === "inspect") {
        return (
            <ButtonGroup>
                <Button onClick={() => handleNavigateToDevice("edit")}>
                    <PencilLine />
                    {en.devicePage.buttons.edit}
                </Button>
            </ButtonGroup>
        )
    }

    return null;
});


const DeviceMapping = observer((
    props: {
        form: UseFormReturn

    }
) => {
    const { form } = props;

    return (
        <Card className="shadow-none bg-transparent">
            <div className="flex items-center gap-2.5 mb-4">
                <div className="p-2 rounded-lg">
                    <Computer className="size-4" />
                </div>
                <div>
                    <CardTitle className="text-sm font-semibold">{en.devicePage.indSectionTitle}</CardTitle>
                    <CardDescription className="text text-sm">{en.devicePage.indSectionDescription}.</CardDescription>
                </div>
            </div>
            <CardContent className="space-y-8">

                <div className="flex gap-2 w-full">
                    <FieldLabel className="text-xs font-medium">
                        {en.devicePage.nameLabel}
                    </FieldLabel>
                    <Separator orientation="vertical" />
                    <Controller
                        name={formFields.logo}
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <div className="flex flex-col gap-1">
                                <Select
                                    value={field.value || "cpu"}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger
                                        aria-invalid={fieldState.invalid}
                                    >
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent align="start">
                                        <SelectGroup>
                                            {Object.entries(LogoMap).map(([key, IconComponent]) => (
                                                <SelectItem key={key} value={key}>
                                                    <div className="flex items-center gap-2">
                                                        <IconComponent className="size-4 shrink-0" />
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>

                                {fieldState.error && (
                                    <span className="text-wrap font-medium text-destructive">
                                        {fieldState.error.message}
                                    </span>
                                )}
                            </div>
                        )}
                    />

                    <Controller
                        name={formFields.name}
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <div className="flex flex-col gap-1 flex-1">
                                <Input
                                    {...field}
                                    placeholder="DAQ6510"
                                    aria-invalid={fieldState.invalid}
                                />
                                {fieldState.error && (
                                    <span className="text-xs text-destructive">
                                        {fieldState.error.message}
                                     </span>
                                )}
                            </div>
                        )}
                    />
                </div>

                <Controller
                    name={formFields.resourceAddress}
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <div className="flex gap-2 w-full">
                            <FieldLabel className="text-xs font-medium text-nowrap">
                                {en.devicePage.resourceAddress}
                            </FieldLabel>
                            <Separator orientation="vertical" />
                            <div className="flex flex-col gap-1 flex-1">
                                <Input
                                    {...field}
                                    placeholder="USB0::0x05E6::..."
                                    aria-invalid={fieldState.invalid}
                                />
                                {fieldState.error && (
                                    <span className="text-xs text-destructive">
                                        {fieldState.error.message}
                                     </span>
                                )}
                            </div>

                        </div>
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
                    <div className="flex flex-col gap-1">
                        <FieldLabel className="text-xs font-medium w-1/3">
                            {en.devicePage.slot}
                        </FieldLabel>
                        <Select value={field.value} onValueChange={field.onChange} disabled={disabled}>
                            <SelectTrigger aria-invalid={fieldState.invalid}>
                                <SelectValue placeholder="Select"  />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">Slot 1</SelectItem>
                                <SelectItem value="2">Slot 2</SelectItem>
                            </SelectContent>
                        </Select>

                        {fieldState.error && (
                            <span className="text-wrap font-medium text-destructive">
                                        {fieldState.error.message}
                                    </span>
                        )}
                    </div>
                )}
            />
            <Controller
                name={channelName}
                control={form.control}
                render={({ field, fieldState }) => (
                    <div>
                        <FieldLabel className="text-xs font-medium">
                            Channel
                        </FieldLabel>
                        <div className="flex flex-col gap-1 flex-1">
                            <Input
                                {...field}
                                placeholder="np. 1"
                                aria-invalid={fieldState.invalid}
                                className="w-full"
                            />
                        </div>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </div>
                )}
            />
        </div>
    );
})


export default DeviceSettingsPage;