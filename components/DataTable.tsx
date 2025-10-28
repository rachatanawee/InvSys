import React from 'react';
// Fix: Import React Table hooks and types from the library instead of window object.
import {
    ColumnDef,
    SortingState,
    ColumnFiltersState,
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    flexRender,
} from '@tanstack/react-table';
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from './ui/Table';
import { Button } from './ui/Button';
import { ChevronUpIcon, ChevronDownIcon } from './ui/Icons';
import { useTranslation } from '../hooks/useTranslation';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export function DataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const { t } = useTranslation();
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
        },
    });

    return (
        <div>
            <div className="rounded-md border border-border dark:border-dark-border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder ? null : (
                                                <div className="flex flex-col gap-2">
                                                    <div
                                                        {...{
                                                            className: header.column.getCanSort()
                                                                ? 'cursor-pointer select-none flex items-center'
                                                                : 'flex items-center',
                                                            onClick: header.column.getToggleSortingHandler(),
                                                        }}
                                                    >
                                                        {flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                        {{
                                                            asc: <ChevronUpIcon className="ml-2 h-4 w-4" />,
                                                            desc: <ChevronDownIcon className="ml-2 h-4 w-4" />,
                                                        }[header.column.getIsSorted() as string] ?? null}
                                                    </div>
                                                    {header.column.getCanFilter() ? (
                                                        <input
                                                            placeholder={t('dataTable.filterPlaceholder')}
                                                            value={(header.column.getFilterValue() ?? '') as string}
                                                            onChange={(event) =>
                                                                header.column.setFilterValue(event.target.value)
                                                            }
                                                            className="w-full h-8 px-2 py-1 bg-background dark:bg-dark-background border border-border dark:border-dark-border rounded-md text-sm focus:ring-1 focus:ring-ring dark:focus:ring-dark-ring focus:outline-none"
                                                            onClick={(e) => e.stopPropagation()} // Prevent sorting when clicking input
                                                        />
                                                    ) : null}
                                                </div>
                                            )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && 'selected'}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    {t('dataTable.noResults')}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                 <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    {t('dataTable.previous')}
                </Button>
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    {t('dataTable.next')}
                </Button>
            </div>
        </div>
    );
}