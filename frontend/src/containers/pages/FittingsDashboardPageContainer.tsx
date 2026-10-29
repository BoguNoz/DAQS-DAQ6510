import {observer} from "mobx-react-lite";
import FittingsDashboardPage from "@/components/pages/FittingsDashboardPage.tsx";
import {useEffect, useState} from "react";
import {z} from "zod";
import {createColumnHelper, type PaginationState, type SortingState} from "@tanstack/react-table";
import {
    fittingsTableColumns,
    fittingsTableFeatures,
    type fittingsTableSchema
} from "@/features/fittings/fittings-table-schema.ts";
import {en} from "@/text/en.ts";
import DateCell from "@/components/layout/data-table/DateCell.tsx";

export const generateMockFittings = (count: number): z.infer<typeof fittingsTableSchema>[] => {
    return Array.from({ length: count }, (_, index) => {
        const id = index + 1;
        // Losowy czas w ciągu ostatnich 7 dni
        const randomTime = new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 3600 * 1000)).toISOString();

        return {
            hash: `hash-${id}`,
            time: randomTime,
            // Losowe wartości w rozsądnych zakresach fizycznych/numerycznych
            anisotropyRatio: Number((1.5 + Math.random() * 1.0).toFixed(2)), // np. 1.50 - 2.50
            k2: Number((1.0e-6 + Math.random() * 2.0e-6).toExponential(2)),
            r32: Number((1.0e-8 + Math.random() * 3.0e-8).toExponential(2)),
            k3: Number((0.8 + Math.random() * 0.5).toFixed(2)),
            kParallel: Number((3.0e-7 + Math.random() * 4.0e-7).toExponential(2)),
            r2Amp: Number((1.0e-4 + Math.random() * 5.0e-4).toExponential(2)),
            r2Phase: Number((1.0e-2 + Math.random() * 3.0e-2).toExponential(2)),
            resNorm: Number((1.0e-9 + Math.random() * 9.0e-9).toExponential(2)),
        };
    });
};

const FittingsDashboardPageContainer = observer(() => {

    const [data, setData] = useState<z.infer<typeof fittingsTableSchema>[]>([]);
    const [pageCount, setPageCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [sorting, setSorting] = useState<SortingState>([]);

    const columnHelper = createColumnHelper<
        typeof fittingsTableFeatures,
        z.infer<typeof fittingsTableSchema>
    >()

    useEffect(() => {
        setIsLoading(true);

        const timer = setTimeout(() => {
            const total = 10;
            const mockData: z.infer<typeof fittingsTableSchema>[] = generateMockFittings(total)

            setData(mockData);
            setPageCount(Math.ceil(total / pagination.pageSize));
            setIsLoading(false);
        }, 300);

        return () => clearTimeout(timer);
    }, [pagination.pageIndex, pagination.pageSize]);

    const columns = columnHelper.columns([
        columnHelper.accessor((row) => row.time, {
            id: fittingsTableColumns.time,
            header: en.fittingsDashboardPage.table.timeColumn,
            enableSorting: true,
            cell: ({row}) => (
                <DateCell
                    value={row.original.time}
                />
            ),
        }),
        columnHelper.accessor((row) => row.anisotropyRatio, {
            id: fittingsTableColumns.anisotropyRatio,
            header: () => (
                <div className="text-left">{en.fittingsDashboardPage.table.anisotropyRatio}</div>
            ),
            cell: ({ getValue }) => (
                <div className="text-left tabular-nums">{getValue()}</div>
            ),
        }),
        columnHelper.accessor((row) => row.k2, {
            id: fittingsTableColumns.k2,
            header: () => (
                <div className="text-left">{en.fittingsDashboardPage.table.k2}</div>
            ),
            cell: ({ getValue }) => (
                <div className="text-left tabular-nums">{getValue()}</div>
            ),
        }),
        columnHelper.accessor((row) => row.r32, {
            id: fittingsTableColumns.r32,
            header: () => (
                <div className="text-left">{en.fittingsDashboardPage.table.r32}</div>
            ),
            cell: ({ getValue }) => (
                <div className="text-left tabular-nums">{getValue()}</div>
            ),
        }),
        columnHelper.accessor((row) => row.k3, {
            id: fittingsTableColumns.k3,
            header: () => (
                <div className="text-left">{en.fittingsDashboardPage.table.k3}</div>
            ),
            cell: ({ getValue }) => (
                <div className="text-left tabular-nums">{getValue()}</div>
            ),
        }),
        columnHelper.accessor((row) => row.kParallel, {
            id: fittingsTableColumns.kParallel,
            header: () => (
                <div className="text-left">{en.fittingsDashboardPage.table.kParallel}</div>
            ),
            cell: ({ getValue }) => (
                <div className="text-left tabular-nums">{getValue()}</div>
            ),
        }),
        columnHelper.accessor((row) => row.r2Amp, {
            id: fittingsTableColumns.r2Amp,
            header: () => (
                <div className="text-left">{en.fittingsDashboardPage.table.r2Amp}</div>
            ),
            cell: ({ getValue }) => (
                <div className="text-left tabular-nums">{getValue()}</div>
            ),
        }),
        columnHelper.accessor((row) => row.r2Phase, {
            id: fittingsTableColumns.r2Phase,
            header: () => (
                <div className="text-left">{en.fittingsDashboardPage.table.r2Phase}</div>
            ),
            cell: ({ getValue }) => (
                <div className="text-left tabular-nums">{getValue()}</div>
            ),
        }),
        columnHelper.accessor((row) => row.resNorm, {
            id: fittingsTableColumns.resNorm,
            header: () => (
                <div className="text-left">{en.fittingsDashboardPage.table.resNorm}</div>
            ),
            cell: ({ getValue }) => (
                <div className="text-left tabular-nums">{getValue()}</div>
            ),
        }),
    ])

    return (
        <FittingsDashboardPage
            initialData={data}
            columns={columns}

            pageCount={pageCount}
            pagination={pagination}
            onPaginationChange={setPagination}

            sorting={sorting}
            onSortingChange={setSorting}

            isLoading={isLoading}
        />
    );
})

export default FittingsDashboardPageContainer;