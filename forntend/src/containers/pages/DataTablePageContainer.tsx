import {observer} from "mobx-react-lite";
import DataTablePage from "@/components/pages/DataTablePage.tsx";
import { z } from "zod"
import {dataTableFields, features, type dataTableSchema} from "@/features/data-table.schema.ts";
import {createColumnHelper, type PaginationState} from "@tanstack/react-table";
import {HeaderCheckBox, RowCheckBox} from "@/components/layout/data-table/CheckBoxColumn.tsx";
import {en} from "@/text/en.ts";
import UserAvatarCell from "@/components/layout/data-table/UserAvatarCell.tsx";
import DeviceCell from "@/components/layout/data-table/DeviceCell.tsx";
import type {LogoKey} from "@/models/device-model.ts";
import DateCell from "@/components/layout/data-table/DateCell.tsx";
import {useEffect, useState} from "react";


const devices = [
    { name: "DAQ6510-A", logo: "cpu" },
    { name: "DAQ6510-B", logo: "gauge" },
    { name: "Modbus-Gateway-01", logo: "smartphone" },
    { name: "Modbus-Gateway-02", logo: "tv" },
    { name: "Sensor-Hub-X1", logo: "battery" },
];

function randomFloat(min: number, max: number, decimals = 2) {
    return Number((Math.random() * (max - min) + min).toFixed(decimals));
}

export const mockDataTable: Array<{
    id: number;
    time: Date;
    device: { name: string; logo: string };
    t1: number;
    t2: number;
    voltage: number;
}> = Array.from({ length: 45 }, (_, i) => {
    const device = devices[i % devices.length];
    const baseTime = new Date("2026-09-25T08:00:00");
    const time = new Date(baseTime.getTime() - i * 5 * 60 * 1000); // co 5 min w tył

    return {
        id: i + 1,
        time,
        device,
        t1: randomFloat(18, 45),
        t2: randomFloat(15, 42),
        voltage: randomFloat(220, 240, 1),
    };
});

const DataTablePageContainer = observer(() => {
    const [data, setData] = useState<z.infer<typeof dataTableSchema>[]>([]);
    const [pageCount, setPageCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    useEffect(() => {
        let cancelled = false;
        setIsLoading(true);

        // symulacja opóźnienia sieciowego, żeby zobaczyć że isLoading realnie działa
        const timeoutId = setTimeout(() => {
            if (cancelled) return;

            const start = pagination.pageIndex * pagination.pageSize;
            const end = start + pagination.pageSize;
            const slice = mockDataTable.slice(start, end);

            setData(slice);
            setPageCount(Math.ceil(mockDataTable.length / pagination.pageSize));
            setIsLoading(false);
        }, 300); // symulowane 300ms "sieciowe"

        return () => {
            cancelled = true;
            clearTimeout(timeoutId);
        };
    }, [pagination.pageIndex, pagination.pageSize]);

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

    return (
        <DataTablePage
            initialData={data}
            columns={columns}
            pageCount={pageCount}
            pagination={pagination}
            onPaginationChange={setPagination}
            isLoading={isLoading}
        />
    );
});

export default DataTablePageContainer;