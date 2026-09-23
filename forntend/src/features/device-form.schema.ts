import * as z from "zod";

export const formFields = {
    name: "name",
    logo: "logo",
    resourceAddress: "resourceAddress",
    thermocouple_1_slot: "thermocouple_1_slot",
    thermocouple_1_channel: "thermocouple_1_channel",
    thermocouple_2_slot: "thermocouple_2_slot",
    thermocouple_2_channel: "thermocouple_2_channel",
    voltage_slot: "voltage_slot",
    voltage_channel: "voltage_channel",
}

export const formSchema = z.object({
    name: z.string().min(5, "Name must be at least 5 characters.").max(32),
    resourceAddress: z.string().min(1, "Resource address is required."),
    thermocouple_1_slot: z.string().min(1, "Select a slot"),
    thermocouple_1_channel: z.string().min(1, "Enter a channel"),
    thermocouple_2_slot: z.string().min(1, "Select a slot"),
    thermocouple_2_channel: z.string().min(1, "Enter a channel"),
    voltage_slot: z.string().min(1, "Select a slot"),
    voltage_channel: z.string().min(1, "Enter a channel"),

});

export type FormSchema = z.infer<typeof formSchema>;