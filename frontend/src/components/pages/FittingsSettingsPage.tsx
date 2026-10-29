import { observer } from "mobx-react-lite";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Box, Braces, Layers, type LucideIcon, NotebookPen, Ruler, Waves} from "lucide-react";
import {en} from "@/text/en.ts";
import {formPrefix} from "@/containers/pages/constants.ts";
import {Controller, type UseFormReturn} from "react-hook-form";
import * as z from "zod";
import {Input} from "@/components/ui/input.tsx";
import {FieldLabel} from "@/components/ui/field.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {fittingsFormFields, fittingsFormSchema} from "@/features/fittings/fittings-form-schema.ts";
import {cn} from "cn";

interface FittingsSettingsPageProps {
    form: UseFormReturn<any, any, any>
    onSubmit: (data: z.infer<typeof fittingsFormSchema>) => Promise<void>
}

const FittingsSettingsPage = observer((props: FittingsSettingsPageProps) => {
    const {form, onSubmit} = props;

    return (
        <div className="min-h-screen p-6 flex flex-col pl-10 pr-10">


            <div className="w-full space-y-6 flex flex-col items-start pt-10">
                <form id={formPrefix} onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                    <fieldset className="w-full space-y-6 group">
                        <div className="flex flex-col md:flex-row gap-6 w-full">
                            <div className="w-full md:w-1/2">
                                <PTRForwardModels
                                    form={form}
                                />
                            </div>
                            <div className="w-full md:w-1/2">
                                <PTRConfiguration
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

const PTRForwardModels = observer((props: {
    form: UseFormReturn<any, any, any>
}) => {
    const {form} = props

    return (
        <Card className="shadow-none bg-transparent">
            <CardHeader className="border-b">
                <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg">
                        <NotebookPen className="size-4" />
                    </div>
                    <div>
                        <CardTitle className="text-sm font-semibold">{en.fittingsSettingsPage.PTRForwardModelsLabel}</CardTitle>
                        <CardDescription className="text text-sm">{en.fittingsSettingsPage.PTRForwardModelsDescription}.</CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-8">
                <Controller
                    name={fittingsFormFields.dataFile}
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <div className="flex gap-2 w-full">
                            <FieldLabel className="text-xs font-medium text-nowrap">
                                {en.fittingsSettingsPage.dataFile}
                            </FieldLabel>
                            <Separator orientation="vertical" />
                            <div className="flex flex-col gap-1 flex-1">
                                <Input
                                    type={"file"}
                                    {...field}
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
                <Controller
                    name={fittingsFormFields.sampleName}
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <div className="flex gap-2 w-full">
                            <FieldLabel className="text-xs font-medium text-nowrap">
                                {en.fittingsSettingsPage.sampleName}
                            </FieldLabel>
                            <Separator orientation="vertical" />
                            <div className="flex flex-col gap-1 flex-1">
                                <Input
                                    placeholder={en.fittingsSettingsPage.placeholders.sampleName}
                                    {...field}
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
                <Controller
                    name={fittingsFormFields.numberOfStarts}
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <div className="flex gap-2 w-full">
                            <FieldLabel className="text-xs font-medium text-nowrap">
                                {en.fittingsSettingsPage.numberOfStarts}
                            </FieldLabel>
                            <Separator orientation="vertical" />
                            <div className="flex flex-col gap-1 flex-1">
                                <Input
                                    placeholder={en.fittingsSettingsPage.placeholders.numberOfStarts.toString()}
                                    {...field}
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
})

const PTRField = observer((props: {
    form: UseFormReturn<any>;
    name: keyof typeof fittingsFormFields
}) => {
    const {form, name} = props

    return (
        <Controller
            name={fittingsFormFields[name]}
            control={form.control}
            render={({ field, fieldState }) => (
                <div className="flex flex-col gap-1.5">
                    <FieldLabel className="text-xs font-medium">
                        {en.fittingsSettingsPage[name]}
                    </FieldLabel>
                    <Input
                        placeholder={en.fittingsSettingsPage.placeholders[name].toString()}
                        {...field}
                        aria-invalid={fieldState.invalid}
                    />
                    {fieldState.error && (
                        <span className="text-xs text-destructive">{fieldState.error.message}</span>
                    )}
                </div>
            )}
        />
    )
})

type PTRGroup = {
    title: string
    icon: LucideIcon
    gridClassName: string
    fields: { name: keyof typeof fittingsFormFields }[]
}

const groups: PTRGroup[] = [
    {
        title: en.fittingsSettingsPage.ptGroup.geometry,
        icon: Ruler,
        gridClassName: "sm:grid-cols-2 lg:grid-cols-3",
        fields: [{ name: "l1" }, { name: "l2" }, { name: "dPump" }],
    },
    {
        title: en.fittingsSettingsPage.ptGroup.l1Params,
        icon: Layers,
        gridClassName: "sm:grid-cols-2",
        fields: [{ name: "k1" }, { name: "alfa1" }],
    },
    {
        title: en.fittingsSettingsPage.ptGroup.l3Params,
        icon: Layers,
        gridClassName: "sm:grid-cols-2",
        fields: [{ name: "k3" }, { name: "alfa3" }],
    },
    {
        title:  en.fittingsSettingsPage.ptGroup.flowAndMaterial,
        icon: Waves,
        gridClassName: "sm:grid-cols-2",
        fields: [{ name: "r21" }, { name: "anisotropy" }, { name: "q" }, { name: "c2" }],
    },
]

const PTRGroupSection = observer((props: {
    form: UseFormReturn<any>
    group: PTRGroup
}) => {
    const {form, group} = props
    const Icon = group.icon

    return (
        <section className="rounded-lg border bg-card/40 overflow-hidden">
            <div className="flex items-center gap-2 border-b px-4 py-2.5">
                <Icon className="size-3.5 text-muted-foreground" />
                <h4 className="text-xs font-semibold">{group.title}</h4>
            </div>
            <div className={cn("grid grid-cols-1 gap-x-4 gap-y-4 p-4", group.gridClassName)}>
                {group.fields.map((f) => (
                    <PTRField key={f.name} form={form} name={f.name} />
                ))}
            </div>
        </section>
    )
})

const PTRConfiguration = observer((props: {
    form: UseFormReturn<any, any, any>
}) => {
    const {form} = props

    return (
        <Card className="shadow-none bg-transparent">
            <CardHeader className="border-b">
                <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg">
                        <Braces className="size-4" />
                    </div>
                    <div>
                        <CardTitle className="text-sm font-semibold">{en.fittingsSettingsPage.PTRConfigurationLabel}</CardTitle>
                        <CardDescription className="text text-sm">{en.fittingsSettingsPage.PTRConfigurationDescription}.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {groups.map((group) => (
                    <PTRGroupSection key={group.title} form={form} group={group} />
                ))}
            </CardContent>
        </Card>
    )
})



export default FittingsSettingsPage;