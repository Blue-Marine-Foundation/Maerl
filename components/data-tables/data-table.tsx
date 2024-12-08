'use client';

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useState } from 'react';
import ColumnFilter from './column-filter';
import SetDateRange from '../date-filtering/set-date-range';
import CopyToCsvButton from './export-data';

interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  filterableColumns?: {
    id: string;
    label: string;
  }[];
  enableDateFilter?: boolean;
  exportData?: (data: TData[]) => Record<string, any>[];
}

export function DataTable<TData>({
  data,
  columns,
  filterableColumns = [],
  enableDateFilter = false,
  exportData,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
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
    <div className='flex flex-col gap-4'>
      <div className='flex items-center justify-between gap-4'>
        <div className='flex items-center justify-start gap-4'>
          {filterableColumns.length > 0 && <p>Filter by:</p>}
          {filterableColumns.map((column) => (
            <ColumnFilter
              key={column.id}
              table={table}
              columnId={column.id}
              label={column.label}
            />
          ))}
          {enableDateFilter && <SetDateRange />}
        </div>

        <div className='flex items-center gap-4'>
          <p>{data.length} items</p>
          {exportData && <CopyToCsvButton data={exportData(data)} />}
        </div>
      </div>

      <div className='rounded-md border'>
        <Table className='overflow-x-auto'>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className='cursor-pointer text-xs'
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
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
                    <TableCell key={cell.id} className='text-xs'>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No items match the selected filters
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
