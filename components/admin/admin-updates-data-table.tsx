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
import { ReviewUpdatesProvider } from '@/hooks/use-debounced-updates';
import { columns } from './admin-update-table-columns';

export default function AdminUpdatesDataTable({
  updates,
  reviewUpdates = updates,
}: {
  updates: Update[];
  reviewUpdates?: Update[];
}) {
  const table = useReactTable({
    data: updates,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (update) => String(update.id),
  });

  return (
    <ReviewUpdatesProvider updates={reviewUpdates}>
      <Table className='w-full table-fixed border-x border-b'>
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
                    className={`h-auto min-w-0 cursor-pointer border-r bg-card px-3 py-2 text-xs last:border-r-0 ${widthClass}`}
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
                      className={`min-w-0 break-words border-r border-r-border/25 px-3 py-2 text-xs last:border-r-0 ${widthClass}`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
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
    </ReviewUpdatesProvider>
  );
}
