'use client'

import { useState } from 'react'

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
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import StatusFilter from './status-filter'
import ProjectTypeFilter from './project-type-filter'
import ColumnFilter from './column-filter'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function ProjectsDataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    project_type: false,
    pillars: false,
    local_contacts: false,
    highlights: false,
    current_issues: false,
    proposed_solutions: false,
    board_intervention_required: false,
  })

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
  })

  return (
    <div>
      <div className="flex items-center justify-between gap-4 pb-4 text-sm">
        <ProjectTypeFilter table={table} />
        <div className="flex items-center gap-4">
          <StatusFilter table={table} />
          <ColumnFilter table={table} />
          <input
            placeholder="Filter by PM"
            value={
              (table.getColumn('projectManager')?.getFilterValue() as string) ??
              ''
            }
            onChange={(event) =>
              table
                .getColumn('projectManager')
                ?.setFilterValue(event.target.value)
            }
            className="max-w-sm bg-background text-foreground border rounded-md px-2 py-1"
          />
          <input
            placeholder="Filter by unit(s)"
            value={(table.getColumn('units')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('units')?.setFilterValue(event.target.value)
            }
            className="max-w-sm bg-background text-foreground border rounded-md px-2 py-1"
          />
        </div>
      </div>
      <div className="rounded-md border bg-card-bg/70">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="px-3 py-2">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
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
                    <TableCell key={cell.id} className="text-xs px-3 py-2">
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
                  No results
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
