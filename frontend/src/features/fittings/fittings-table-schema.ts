import {
    createCoreRowModel, createPaginatedRowModel,
    createSortedRowModel, rowPaginationFeature,
    rowSelectionFeature,
    rowSortingFeature,
    tableFeatures
} from "@tanstack/react-table";
import {z} from "zod";

export const fittingsTableFeatures = tableFeatures({
    rowPaginationFeature,
    rowSelectionFeature,
    rowSortingFeature,
    paginatedRowModel: createPaginatedRowModel(),
    sortedRowModel: createSortedRowModel(),
    coreRowModel: createCoreRowModel(),
});

export const fittingsTableColumns = {
    time: "time",
    anisotropyRatio: "anisotropyRatio",
    k2: "k2",
    r32: "r32",
    k3: "k3",
    kParallel: "kParallel",
    r2Amp: "r2Amp",
    r2Phase: "r2Phase",
    resNorm: "resNorm",
}

export const fittingsTableSchema = z.object({
    hash: z.string(),
    time: z.string(),
    anisotropyRatio: z.number(),
    k2: z.number(),
    r32: z.number(),
    k3: z.number(),
    kParallel: z.number(),
    r2Amp: z.number(),
    r2Phase: z.number(),
    resNorm: z.number(),
})