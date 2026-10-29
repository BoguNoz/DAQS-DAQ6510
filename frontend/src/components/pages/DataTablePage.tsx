import {observer} from "mobx-react-lite";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {dataTableColumns, dataTableSchema, dataTableFeatures} from "@/features/daqqs/data-table.schema.ts";
import {z} from "zod";
import {
    type ColumnFilter,
    type ColumnFiltersState,
    type ColumnVisibilityState,
    FlexRender, type OnChangeFn,
    type PaginationState,
    type Row,
    type SortingState, useTable
} from "@tanstack/react-table";
import {useId, useMemo, useState} from "react";
import {type UniqueIdentifier} from "@dnd-kit/core";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Button} from "@/components/ui/button.tsx";
import {ChevronDownIcon, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Columns2, Filter, Loader2, X} from "lucide-react";
import {en} from "@/text/en.ts";
import {SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {Label} from "@/components/ui/label.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {Field, FieldGroup, FieldLabel} from "@/components/ui/field";
import { format } from "date-fns"
import {Calendar} from "@/components/ui/calendar.tsx";
import DataTableFooter from "@/components/layout/data-table/DataTableFooter.tsx";

export interface RangeValue {
    min?: number;
    max?: number;
}

export interface DateRangeValue {
    from?: string; // ISO string
    to?: string;
}

interface DataTablePageProps {
    initialData: z.infer<typeof dataTableSchema>[]
    columns: any;

    pageCount: number;
    pagination: PaginationState;
    onPaginationChange: OnChangeFn<PaginationState>;

    columnVisibility: ColumnVisibilityState;
    onColumnVisibilityChange: OnChangeFn<ColumnVisibilityState>;

    columnFilters: ColumnFiltersState;
    onColumnFilterChange: OnChangeFn<ColumnFiltersState>;

    sorting: SortingState;
    onSortingChange: OnChangeFn<SortingState>;

    getFilterValue: <T>(filters: ColumnFiltersState, id: string) => (T | undefined);
    setFilterValue: (filters: ColumnFiltersState, id: string, value: unknown) => ColumnFilter[]

    isLoading?: boolean;
}

const DataTablePage = observer((props: DataTablePageProps) => {
    const {
        initialData,
        columns,
        pageCount,
        pagination,
        onPaginationChange,
        columnVisibility,
        onColumnVisibilityChange,
        sorting,
        onSortingChange,
        columnFilters,
        onColumnFilterChange,
        getFilterValue,
        setFilterValue,
        isLoading,
    } = props;

    const sortableId = useId();

    const dataIds = useMemo<UniqueIdentifier[]>(
        () => initialData?.map(({ hash }) => hash) || [],
        [initialData]
    );

    const table = useTable({
        features: dataTableFeatures,
        data: initialData,
        columns,
        manualPagination: true,
        manualFiltering: true,
        pageCount,
        state: {
            sorting,
            columnVisibility,
            columnFilters,
            pagination,
        },
        getRowId: (row) => row.hash,
        onSortingChange: onSortingChange,
        onColumnFiltersChange: onColumnFilterChange,
        onColumnVisibilityChange: onColumnVisibilityChange,
        onPaginationChange,
    });


    return (
        <div className="pt-6">
            <div>
                <TableFilteringHeader
                    table={table}
                    columnFilters={columnFilters}
                    onColumnFiltersChange={onColumnFilterChange}
                    getFilterValue={getFilterValue}
                    setFilterValue={setFilterValue}
                />
            </div>
            <div className="overflow-hidden rounded-lg border">
                <Table className="table-fixed w-full min-w-[750px]">
                    <TableHeader className="sticky top-0 z-10 bg-muted">
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
                                key={JSON.stringify(columnVisibility)}
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
            <DataTableFooter table={table}/>
        </div>
    );
});




const DataTableRow = observer((
    props: {
        row:  Row<typeof dataTableFeatures, z.infer<typeof dataTableSchema>>
    }
) => {
    const {row} = props;

    return (
        <TableRow>
            {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                    <FlexRender cell={cell} />
                </TableCell>
            ))}
        </TableRow>
    );

});

const TableFilteringHeader = observer((
    props: {
        table: any;
        columnFilters: ColumnFiltersState;
        onColumnFiltersChange: (filters: ColumnFiltersState) => void;
        getFilterValue: <T>(filters: ColumnFiltersState, id: string) => (T | undefined);
        setFilterValue: (filters: ColumnFiltersState, id: string, value: unknown) => ColumnFilter[]
    }
) => {
    const {table, columnFilters, onColumnFiltersChange, getFilterValue, setFilterValue} = props;

    return (
        <div className="flex items-center gap-2 pb-4">
            <DataTableFilters
                columnFilters={columnFilters}
                onColumnFiltersChange={onColumnFiltersChange}
                getFilterValue={getFilterValue}
                setFilterValue={setFilterValue}
            />
            <ColumnFiltering table={table} />
        </div>
    );
});

const ColumnFiltering = observer((
    props: {
        table: any
    }
) => {
    const {table} = props;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                    <Columns2 />
                    <span>{en.dataTablePage.filtering.columnFiltering}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                {table
                    .getAllColumns()
                    .filter(
                        (column) =>
                            typeof column.accessorFn !== "undefined" &&
                            column.getCanHide()
                    )
                    .map((column) => {
                        return (
                            <DropdownMenuCheckboxItem
                                key={column.id}
                                className="capitalize"
                                checked={column.getIsVisible()}
                                onCheckedChange={(value) =>
                                    column.toggleVisibility(!!value)
                                }
                            >
                                {column.id}
                            </DropdownMenuCheckboxItem>
                        )
                    })}

            </DropdownMenuContent>
        </DropdownMenu>
    );
})

const DataTableFilters = observer((
    props: {
        columnFilters: ColumnFiltersState;
        onColumnFiltersChange: (filters: ColumnFiltersState) => void;
        getFilterValue: <T>(filters: ColumnFiltersState, id: string) => (T | undefined);
        setFilterValue: (filters: ColumnFiltersState, id: string, value: unknown) => ColumnFilter[]
    }
) => {
    const { columnFilters, onColumnFiltersChange, getFilterValue, setFilterValue } = props;

    // draft = lokalny stan, niezastosowany jeszcze do tabeli/API
    const [draft, setDraft] = useState<ColumnFiltersState>(columnFilters);
    const [open, setOpen] = useState(false);

    const timeRange = getFilterValue<DateRangeValue>(draft, dataTableColumns.time) ?? {};
    const device = getFilterValue<string>(draft, dataTableColumns.device) ?? "";
    const t1Range = getFilterValue<RangeValue>(draft, dataTableColumns.t1) ?? {};
    const t2Range = getFilterValue<RangeValue>(draft, dataTableColumns.t2) ?? {};
    const voltageRange = getFilterValue<RangeValue>(draft, dataTableColumns.voltage) ?? {};

    const activeCount = columnFilters.length;

    const handleApply = () => {
        console.log("APPLY draft", draft);
        onColumnFiltersChange(draft);
        setOpen(false);
    };

    const handleReset = () => {
        setDraft([]);
        onColumnFiltersChange([]);
        setOpen(false);
    };

    return (
        <Popover
            open={open}
            onOpenChange={(next) => {
                setOpen(next);
                if (next) setDraft(columnFilters); // sync draft z aktualnym stanem po otwarciu
            }}
        >
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                    <Filter />
                    <span>{en.dataTablePage.filtering.dataFiltering}</span>
                    {activeCount > 0 && (
                        <span className="ml-1 rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
                            {activeCount}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-80 space-y-4">
                <div className="space-y-5">
                   <DataPicker
                       draft={draft}
                       onDraftChange={setDraft}
                       getFilterValue={getFilterValue}
                       setFilterValue={setFilterValue}
                       field="from"
                       label={en.dataTablePage.filtering.timeForm}
                   />
                    <DataPicker
                        draft={draft}
                        onDraftChange={setDraft}
                        getFilterValue={getFilterValue}
                        setFilterValue={setFilterValue}
                        field="to"
                        label={en.dataTablePage.filtering.timeTo}
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-xs font-medium">
                        {en.dataTablePage.table.deviceColumn}
                    </Label>
                    <Input
                        placeholder={en.dataTablePage.filtering.devicePlaceholder}
                        value={device ?? ""}
                        onChange={(e) =>
                            setDraft(setFilterValue(draft, dataTableColumns.device, e.target.value))
                        }
                    />
                </div>

                {/* T1 range */}
                <RangeFilterField
                    label={en.dataTablePage.table.thermocouple_1Column}
                    value={t1Range}
                    onChange={(next) =>
                        setDraft(setFilterValue(draft, dataTableColumns.t1, next))
                    }
                />

                {/* T2 range */}
                <RangeFilterField
                    label={en.dataTablePage.table.thermocouple_2Column}
                    value={t2Range}
                    onChange={(next) =>
                        setDraft(setFilterValue(draft, dataTableColumns.t2, next))
                    }
                />

                {/* Voltage range */}
                <RangeFilterField
                    label={en.dataTablePage.table.voltageColumn}
                    value={voltageRange}
                    onChange={(next) =>
                        setDraft(setFilterValue(draft, dataTableColumns.voltage, next))
                    }
                />

                <div className="flex items-center gap-2 pt-2">
                    <Button variant="outline"onClick={handleReset}>
                        <X className="h-4 w-4" />
                        {en.dataTablePage.filtering.reset}
                    </Button>
                    <Button onClick={handleApply}>
                        {en.dataTablePage.filtering.apply}
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
});

const RangeFilterField = observer((
    props: {
        label: string;
        value: RangeValue;
        onChange: (value: RangeValue | undefined) => void;
    }
) => {
    const { label, value, onChange } = props;

    const handleChange = (key: "min" | "max", raw: string) => {
        const num = raw === "" ? undefined : Number(raw);
        const next = { ...value, [key]: num };
        const isEmpty = next.min === undefined && next.max === undefined;
        onChange(isEmpty ? undefined : next);
    };

    return (
        <div className="space-y-2">
            <Label className="text-xs font-medium">{label}</Label>
            <div className="flex gap-2">
                <Input
                    placeholder="Min"
                    value={value.min ?? ""}
                    onChange={(e) => handleChange("min", e.target.value)}
                />
                <Input
                    placeholder="Max"
                    value={value.max ?? ""}
                    onChange={(e) => handleChange("max", e.target.value)}
                />
            </div>
        </div>
    );
});

const DataPicker = observer((
    props: {
        draft: ColumnFiltersState,
        onDraftChange: OnChangeFn<ColumnFiltersState>,
        getFilterValue: <T>(filters: ColumnFiltersState, id: string) => (T | undefined),
        setFilterValue: (filters: ColumnFiltersState, id: string, value: unknown) => ColumnFilter[]
        field: "from" | "to",
        label: string,
    }
) => {
    const {draft, onDraftChange, getFilterValue, setFilterValue, field, label} = props;

    const [open, setOpen] = useState(false);

    const timeRange = getFilterValue<DateRangeValue>(draft, dataTableColumns.time) ?? {};
    const currentIso = timeRange[field];
    const date = currentIso ? new Date(currentIso) : undefined;

    return (
        <FieldGroup className="mx-auto max-w-xs flex-row">
            <Field>
                <FieldLabel htmlFor={`date-picker-${field}`}>
                    {label}
                </FieldLabel>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            id={`date-picker-${field}`}
                            className="w-32 justify-between font-normal"
                        >
                            {date ? format(date, "PPP") : "Select date"}
                            <ChevronDownIcon data-icon="inline-end" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={date}
                            captionLayout="dropdown"
                            defaultMonth={date}
                            onSelect={(selectedDate) => {
                                if (!selectedDate) return;

                                const combined = new Date(selectedDate);
                                if (date) {
                                    combined.setHours(date.getHours(), date.getMinutes(), date.getSeconds());
                                }

                                onDraftChange(
                                    setFilterValue(draft, dataTableColumns.time, {
                                        ...timeRange,
                                        [field]: combined.toISOString(),
                                    })
                                );
                                setOpen(false);
                            }}
                        />
                    </PopoverContent>
                </Popover>
            </Field>
            <Field className="w-1/3 pt-6">
                <Input
                    type="time"
                    id={`time-picker-${field}`}
                    step="1"
                    value={date ? format(date, "HH:mm:ss") : "00:00:00"}
                    disabled={!date}
                    onChange={(e) => {
                        if (!date) return;

                        const [hours, minutes, seconds] = e.target.value.split(":").map(Number);
                        const combined = new Date(date);
                        combined.setHours(hours ?? 0, minutes ?? 0, seconds ?? 0, 0);

                        onDraftChange(
                            setFilterValue(draft, dataTableColumns.time, {
                                ...timeRange,
                                [field]: combined.toISOString(),
                            })
                        );
                    }}
                    className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                />
            </Field>
        </FieldGroup>
    );
});

export default DataTablePage;