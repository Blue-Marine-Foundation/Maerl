'use client';

import {
  flexRender,
  getCoreRowModel,
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
import { Update } from '@/utils/types';
import { columns } from './admin-update-table-columns';

export default function AdminUpdatesDataTable({
  updates,
}: {
  updates: Update[];
}) {
  const table = useReactTable({
    data: updates,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table className='border-x border-b'>
      <TableHeader className='sticky top-[78px] z-10 bg-card'>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} className='flex w-full border-t'>
            {headerGroup.headers.map((header) => {
              const widthClass =
                (header.column.columnDef as any).meta?.widthClass || '';
              return (
                <TableHead
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className={`h-auto cursor-pointer whitespace-nowrap border-r bg-card px-3 py-2 text-xs last:border-r-0 ${widthClass}`}
                >
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
              className='flex w-full'
            >
              {row.getVisibleCells().map((cell) => {
                const widthClass =
                  (cell.column.columnDef as any).meta?.widthClass || '';
                return (
                  <TableCell
                    key={cell.id}
                    className={`border-r border-r-border/25 px-3 py-2 text-xs last:border-r-0 ${widthClass}`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                );
              })}
            </TableRow>
          ))
        ) : (
          <TableRow className='flex w-full'>
            <TableCell
              colSpan={columns.length}
              className='h-24 w-full text-center'
            >
              No items match the selected filters
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
