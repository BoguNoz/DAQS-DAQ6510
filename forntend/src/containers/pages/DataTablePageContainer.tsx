import {observer} from "mobx-react-lite";
import DataTablePage from "@/components/pages/DataTablePage.tsx";
import {z} from "zod"
import {dataTableFields, type dataTableSchema, features} from "@/features/data-table.schema.ts";
import {
    type ColumnFiltersState,
    type ColumnVisibilityState,
    createColumnHelper,
    type PaginationState,
    type SortingState
} from "@tanstack/react-table";
import {en} from "@/text/en.ts";
import DeviceCell from "@/components/layout/data-table/DeviceCell.tsx";
import type {LogoKey} from "@/models/device/device.ts";
import DateCell from "@/components/layout/data-table/DateCell.tsx";
import {useCallback, useEffect, useMemo, useState} from "react";
import type {DataStoreInterface} from "@/stores/data-store";
import {toast} from "sonner";


export interface DataTablePageProps {
    dataStore: DataStoreInterface;
}


const DataTablePageContainer = observer((props: DataTablePageProps) => {
    const { dataStore } = props;

    const [data, setData] = useState<z.infer<typeof dataTableSchema>[]>([]);
    const [pageCount, setPageCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<ColumnVisibilityState>({});
    const [sorting, setSorting] = useState<SortingState>([]);


    useEffect(() => {
        let cancelled = false;
        setIsLoading(true);

        const timeoutId = setTimeout(async () => {
            try {
                const {items, total} = await dataStore.listMeasurements(
                    columnFilters,
                    pagination.pageIndex,
                    pagination.pageSize,
                );
                if (cancelled) return;

                setData(items);
                setPageCount(Math.ceil(total / pagination.pageSize));
            } catch {
                if (!cancelled) {
                    toast.error(en.toast.loadingError );
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        }, 300);

        return () => {
            cancelled = true;
            clearTimeout(timeoutId);
        };
    }, [dataStore, pagination.pageIndex, pagination.pageSize, columnFilters]);

    useEffect(() => {
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }, [columnFilters]);


    const columnHelper = createColumnHelper<
        typeof features,
        z.infer<typeof dataTableSchema>
    >()

    const columns = columnHelper.columns([
      /*  columnHelper.accessor((row) => row.user.name, {
            id: dataTableFields.user,
            header: en.dataTablePage.table.userColumn,
            cell: ({ row }) => (
                <UserAvatarCell
                    name={row.original.user.name}
                    avatarKey={row.original.user.avatarKey}
                />
            ),
        }),*/
        columnHelper.accessor((row) => row.time, {
            id: dataTableFields.time,
            header: en.dataTablePage.table.timeColumn,
            cell: ({row}) => (
               <DateCell
                   value={row.original.time}
               />
            ),
        }),
        columnHelper.accessor((row) => row.device.name, {
            id: dataTableFields.device,
            header: en.dataTablePage.table.deviceColumn,
            cell: ({row}) => (
                <DeviceCell
                    name={row.original.device.name}
                    logo={row.original.device.logo as LogoKey}
                />
            ),
        }),
        columnHelper.accessor((row) => row.t1, {
            id: dataTableFields.t1,
            header: () => (
                <div className="text-left">{en.dataTablePage.table.thermocouple_1Column}</div>
            ),
            cell: ({ getValue }) => (
                <div className="text-left tabular-nums">{getValue().toFixed(4)}</div>
            ),
        }),
        columnHelper.accessor((row) => row.t2, {
            id: dataTableFields.t2,
            header: () => (
                <div className="text-left">{en.dataTablePage.table.thermocouple_2Column}</div>
            ),
            cell: ({ getValue }) => (
                <div className="text-left tabular-nums">{getValue().toFixed(4)}</div>
            ),
        }),
        columnHelper.accessor((row) => row.voltage, {
            id: dataTableFields.voltage,
            header: () => (
                <div className="text-left">{en.dataTablePage.table.voltageColumn}</div>
            ),
            cell: ({ getValue }) => (
                <div className="text-left tabular-nums">{getValue().toFixed(4)}</div>
            ),
        }),
    ]);

    const getFilterValue = useCallback(
        <T,>(filters: ColumnFiltersState, id: string): T | undefined => {
            return filters.find((f) => f.id === id)?.value as T | undefined;
    }, []);

    const setFilterValue = useCallback((filters: ColumnFiltersState, id: string, value: unknown) => {
        const withoutId = filters.filter((f) => f.id !== id);
        if (value === undefined || value === "" || value === null) {
            return withoutId;
        }
        return [...withoutId, { id, value }];
    }, [])

    return (
        <DataTablePage
            initialData={data}
            columns={columns}

            pageCount={pageCount}
            pagination={pagination}
            onPaginationChange={setPagination}

            columnVisibility={columnVisibility}
            onColumnVisibilityChange={setColumnVisibility}

            columnFilters={columnFilters}
            onColumnFilterChange={setColumnFilters}

            sorting={sorting}
            onSortingChange={setSorting}

            getFilterValue={getFilterValue}
            setFilterValue={setFilterValue}

            isLoading={isLoading}
        />
    );
});

export default DataTablePageContainer;