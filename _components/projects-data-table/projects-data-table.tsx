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

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

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
      <div className="flex items-center gap-4 pb-6 text-sm">
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

        <Popover>
          <PopoverTrigger className="border rounded-md px-3 py-1">
            Show/hide columns
          </PopoverTrigger>
          <PopoverContent className="flex flex-col gap-2">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <label key={column.id}>
                    <input
                      type="checkbox"
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onChange={(e) =>
                        column.toggleVisibility(e.target.checked)
                      }
                    />
                    <span className="ml-2">
                      {column.id
                        .split('_')
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(' ')}
                    </span>
                  </label>
                )
              })}
          </PopoverContent>
        </Popover>
      </div>
      <div className="rounded-md border">
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
