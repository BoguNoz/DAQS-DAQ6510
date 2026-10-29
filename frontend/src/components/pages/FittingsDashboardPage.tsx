import {observer} from "mobx-react-lite";
import {z} from "zod";
import {fittingsTableFeatures, fittingsTableSchema} from "@/features/fittings/fittings-table-schema.ts";
import {
    FlexRender,
    type OnChangeFn,
    type PaginationState,
    type Row,
    type SortingState,
    useTable
} from "@tanstack/react-table";
import DataTableFooter from "@/components/layout/data-table/DataTableFooter.tsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {Loader2} from "lucide-react";
import {SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {useMemo} from "react";
import type {UniqueIdentifier} from "@dnd-kit/core";
import {dataTableFeatures, dataTableSchema} from "@/features/daqqs/data-table.schema.ts";


interface FittingsTableProps {
    initialData: z.infer<typeof fittingsTableSchema>[]
    columns: any;

    pageCount: number;
    pagination: PaginationState;
    onPaginationChange: OnChangeFn<PaginationState>;

    sorting: SortingState;
    onSortingChange: OnChangeFn<SortingState>;

    isLoading?: boolean;
}

interface FittingsDashboardPageProps extends FittingsTableProps {

}

const FittingsDashboardPage = observer((props: FittingsDashboardPageProps) => {
    return (
        <div>
            <FittingsTable {...props} />
        </div>
    );
});

const FittingsTable = observer((props: FittingsTableProps) => {

    const {initialData, columns, pageCount, pagination, onPaginationChange, onSortingChange, sorting, isLoading} = props;

    const dataIds = useMemo<UniqueIdentifier[]>(
        () => initialData?.map(({ hash }) => hash) || [],
        [initialData]
    );

    const table = useTable({
        features: fittingsTableFeatures,
        data: initialData,
        columns,
        manualPagination: true,
        pageCount,
        state: {
            sorting,
            pagination,
        },
        getRowId: (row) => row.hash,
        onSortingChange: onSortingChange,
        onPaginationChange,
    });

    return (
        <div className="pt-6">
            <DataTableFooter table={table} />
            <div className="pt-6"/>
            <div className="w-full overflow-x-auto rounded-lg border">
                <Table className="w-full min-w-[1000px]">
                    <TableHeader className="sticky top-0 z-20 bg-muted">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} colSpan={header.colSpan}>
                                            {header.isPlaceholder ? null : (
                                                <FlexRender header={header} />
                                            )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}

                    </TableHeader>
                    <TableBody className="**:data-[slot=table-cell]:first:w-8">
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows?.length ? (
                            <SortableContext
                                items={dataIds}
                                strategy={verticalListSortingStrategy}
                            >
                                {table.getRowModel().rows.map((row) => (
                                    <DataTableRow key={row.id} row={row} />
                                ))}
                            </SortableContext>
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )

})

const DataTableRow = observer((
    props: {
        row:  Row<typeof fittingsTableFeatures, z.infer<typeof fittingsTableSchema>>
    }
) => {
    const {row} = props;

    return (
        <TableRow>
            {row.getAllCells().map((cell) => (
                <TableCell key={cell.id}>
                    <FlexRender cell={cell} />
                </TableCell>
            ))}
        </TableRow>
    );

});

export default FittingsDashboardPage;