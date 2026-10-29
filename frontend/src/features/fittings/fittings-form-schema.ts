import * as z from "zod";
import {deviceFormSchema} from "@/features/daqqs/device-form.schema.ts";

export const fittingsFormFields = {
    dataFile: "dataFile",
    sampleName: "sampleName",
    numberOfStarts: "numberOfStarts",
    useBayesianOptimization: "useBayesianOptimization",
    l2: "l2",
    k1: "k1",
    l1: "l1",
    alfa1: "alfa1",
    k3: "k3",
    alfa3: "alfa3",
    r21: "r21",
    dPump: "dPump",
    anisotropy: "anisotropy",
    q: "q",
    c2: "c2",
}

export const fittingsFormSchema = z.object({
    dataFile: z.file().min(1, "Data file is required"),
    sampleName: z.string(),
    numberOfStarts: z.number().min(1, "The minimum number of starts is required").max(20),
    useBayesianOptimization: z.boolean(),
    l2: z.number(),
    k1: z.number(),
    l1: z.number(),
    alfa1: z.number(),
    k3: z.number(),
    alfa3: z.number(),
    r21: z.number(),
    dPump: z.number(),
    anisotropy: z.number(),
    q: z.number(),
    c2: z.number(),
});

export type FittingsFormSchema = z.infer<typeof fittingsFormSchema>;