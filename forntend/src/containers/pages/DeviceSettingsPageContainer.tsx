import {observer} from "mobx-react-lite";
import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "sonner";
import {useCallback} from "react";
import { formSchema } from "@/features/device-form.schema";
import DeviceSettingsPage from "@/components/pages/DeviceSettingsPage.tsx";
import {useParams} from "react-router-dom";




const DeviceSettingsPageContainer = observer(() => {
    const { variant } = useParams();

    const validVariant = (["inspect", "edit", "add"].includes(variant!) ? variant : "inspect") as "inspect" | "edit" | "add";

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            resourceAddress: "",
            thermocouple_1_slot: "",
            thermocouple_1_channel: "",
            thermocouple_2_slot: "",
            thermocouple_2_channel: "",
            voltage_slot: "",
            voltage_channel: "",
        },
    });

    const onSubmit = useCallback((data: z.infer<typeof formSchema>) => {
        toast("Zapisano konfigurację urządzenia:", {
            description: (
                <pre className="mt-2 w-[320px] overflow-x-auto rounded-md bg-zinc-950 p-4 text-zinc-50 font-mono text-xs">
                    <code>{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
            position: "bottom-right",
        });
    }, []);


    return (
        <DeviceSettingsPage
            form={form}
            onSubmit={onSubmit}
            variant={validVariant}
        />
    );

});

export default DeviceSettingsPageContainer;