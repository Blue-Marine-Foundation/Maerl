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
import * as d3 from 'd3';
interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  filterableColumns?: {
    id: string;
    label: string;
    type?: 'text' | 'list';
    placeholder?: string;
  }[];
  enableDateFilter?: boolean;
  enableExport?: boolean;
}

export function DataTable<TData>({
  data,
  columns,
  filterableColumns = [],
  enableDateFilter = false,
  enableExport = true,
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
          {filterableColumns?.map(({ id, label, type, placeholder }) => (
            <ColumnFilter
              key={id}
              table={table}
              columnId={id}
              label={label}
              type={type}
              placeholder={placeholder}
            />
          ))}
          {enableDateFilter && <SetDateRange />}
        </div>

        <div className='flex items-center gap-4'>
          <p>{d3.format(',')(table.getFilteredRowModel().rows.length)} items</p>
          {enableExport && (
            <CopyToCsvButton
              data={table.getFilteredRowModel().rows.map((row) => row.original)}
            />
          )}
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
