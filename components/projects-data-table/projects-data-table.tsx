'use client';

import { useState } from 'react';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  VisibilityState,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import ColumnVisibilityToggle from './column-visibility-toggle';
import ColumnFilter from './column-filter';
import ListColumnFilter from './list-column-filter';
import ExportButton from '@/components/data-tables/export-button';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function ProjectsDataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    start_date: false,
    project_type: false,
    pillars: false,
    local_contacts: false,
    highlights: false,
    current_issues: false,
    proposed_solutions: false,
    board_intervention_required: false,
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <div>
      <p className='mb-6 max-w-fit rounded-md bg-blue-500/20 px-4 py-3'>
        Showing {table.getRowModel().rows.length} projects
      </p>
      <div className='flex items-center justify-between gap-4 pb-4 text-sm'>
        <div className='flex items-center gap-4'>
          <p className='text-sm'>Filter by:</p>
          <ColumnFilter table={table} columnId='project_type' />
          <ColumnFilter table={table} columnId='project_status' />
          <ColumnFilter table={table} columnId='regional_strategy' />
          <ListColumnFilter table={table} columnId='pillars' />
          <ListColumnFilter table={table} columnId='unit_requirements' />
          <input
            placeholder='Filter by person'
            value={(table.getColumn('pm')?.getFilterValue() as string) ?? ''}
            onChange={(event) => {
              table.getColumn('pm')?.setFilterValue(event.target.value);
              table.getColumn('support')?.setFilterValue(event.target.value);
            }}
            className='max-w-sm rounded-md border bg-background px-2 py-1 text-foreground'
          />
        </div>
        <div className='flex items-center gap-4'>
          <ColumnVisibilityToggle table={table} />
          <ExportButton
            table={table}
            filename={`${new Date().toISOString().split('T')[0]}-projects-list.csv`}
          />
        </div>
      </div>
      <div className='rounded-md border bg-card'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className='px-3 py-2'>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
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
                    <TableCell key={cell.id} className='px-3 py-2 text-xs'>
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
                  No results
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
