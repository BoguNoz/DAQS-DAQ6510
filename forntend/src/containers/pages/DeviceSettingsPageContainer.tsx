import {observer} from "mobx-react-lite";
import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "sonner";
import {useCallback, useEffect} from "react";
import { formSchema } from "@/features/device-form.schema";
import DeviceSettingsPage from "@/components/pages/DeviceSettingsPage.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {roots} from "@/roots/root.tsx";
import {deviceStorage} from "@/helpers/device-storage.ts";
import type {DeviceModel} from "@/models/device-model.ts";
import {en} from "@/text/en.ts";




const DeviceSettingsPageContainer = observer(() => {
    const { variant, deviceName, deviceId } = useParams();

    const navigate = useNavigate();

    const validVariant = (["inspect", "edit", "add"].includes(variant!) ? variant : "inspect") as "inspect" | "edit" | "add";

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            logo: "cpu",
            resourceAddress: "",
            thermocouple_1_slot: "",
            thermocouple_1_channel: "",
            thermocouple_2_slot: "",
            thermocouple_2_channel: "",
            voltage_slot: "",
            voltage_channel: "",
        },
    });

    useEffect(() => {
        if (validVariant !== "add" && deviceId) {
            const existingDevice = deviceStorage.getByAddress(deviceId);

            if (existingDevice) {
                form.reset({
                    name: existingDevice.name,
                    logo: existingDevice.logo,
                    resourceAddress: existingDevice.resourceAddress,
                    thermocouple_1_slot: existingDevice.thermocouple_1_slot || "",
                    thermocouple_1_channel: existingDevice.thermocouple_1_channel || "",
                    thermocouple_2_slot: existingDevice.thermocouple_2_slot || "",
                    thermocouple_2_channel: existingDevice.thermocouple_2_channel || "",
                    voltage_slot: existingDevice.voltage_slot || "",
                    voltage_channel: existingDevice.voltage_channel || "",
                });
            }
        } else if (validVariant === "add") {
            form.reset({
                name: "",
                logo: "cpu",
                resourceAddress: "",
                thermocouple_1_slot: "",
                thermocouple_1_channel: "",
                thermocouple_2_slot: "",
                thermocouple_2_channel: "",
                voltage_slot: "",
                voltage_channel: "",
            });
        }
    }, [deviceId, validVariant, form]);

    const onSubmit = useCallback((data: z.infer<typeof formSchema>) => {
        const deviceData: DeviceModel = {
            name: data.name,
            logo: data.logo as DeviceModel["logo"],
            resourceAddress: data.resourceAddress,
            thermocouple_1_slot: data.thermocouple_1_slot,
            thermocouple_1_channel: data.thermocouple_1_channel,
            thermocouple_2_slot: data.thermocouple_2_slot,
            thermocouple_2_channel: data.thermocouple_2_channel,
            voltage_slot: data.voltage_slot,
            voltage_channel: data.voltage_channel,
        };

        deviceStorage.save(deviceData, deviceId);

        toast.success(en.toast.deviceUpdate)

    }, [deviceId]);

    const handleDelete = useCallback(() => {
        if (deviceId) {
            deviceStorage.remove(deviceId);
            toast.info(en.toast.deviceDelete);
            navigate(`/${roots.device}/add`);
        }
    }, [deviceId, navigate]);

    const handleEditability = useCallback((variant?: "inspect" | "edit" | "add"): boolean => {
        return variant == "inspect";

    }, [])

    const handleNavigateToDevice = useCallback((variant: "inspect" | "edit" | "add") => {
        if (variant === "add") {
            navigate(`/${roots.device}/${variant}`);
        } else {
            navigate(`/${roots.device}/${variant}/${deviceName}/${deviceId}`);
        }
    }, [navigate, deviceName, deviceId]);



    return (
        <DeviceSettingsPage
            form={form}
            onSubmit={onSubmit}
            variant={validVariant}
            handleEditability={handleEditability}
            handleNavigateToDevice={handleNavigateToDevice}
            handleDelete={handleDelete}
        />
    );

});

export default DeviceSettingsPageContainer;