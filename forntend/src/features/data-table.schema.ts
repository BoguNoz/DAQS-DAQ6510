import {z} from "zod";
import {
    columnFilteringFeature,
    columnVisibilityFeature, createFilteredRowModel, createPaginatedRowModel, createSortedRowModel,
    rowPaginationFeature, rowSelectionFeature, rowSortingFeature,
    tableFeatures
} from "@tanstack/react-table";

export const features = tableFeatures({
    columnFilteringFeature,
    columnVisibilityFeature,
    rowPaginationFeature,
    rowSelectionFeature,
    rowSortingFeature,
    filteredRowModel: createFilteredRowModel(),
    paginatedRowModel: createPaginatedRowModel(),
    sortedRowModel: createSortedRowModel(),
});

export const dataTableFields = {
    user: "user",
    time: "time",
    device: "device",
    t1: "t1",
    t2: "t2",
    voltage: "voltage",
}

export const dataTableSchema = z.object({
    id: z.number(),
    /*user: z.object({
        name: z.string(),
        avatarKey: z.string().nullable().optional(),
    }),*/
    time: z.date(),
    device: z.object({
        name: z.string(),
        logo: z.string(),
    }),
    t1: z.number(),
    t2: z.number(),
    voltage: z.number(),
})
