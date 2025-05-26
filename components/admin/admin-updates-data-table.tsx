'use client';

import {
  ColumnDef,
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
import { format } from 'date-fns';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '../ui/hover-card';

export default function AdminUpdatesDataTable({
  updates,
}: {
  updates: Update[];
}) {
  const columns: ColumnDef<Update>[] = [
    {
      header: 'Date',
      accessorKey: 'date',
      cell: ({ row }) => (
        <p className='w-20'>{format(row.original.date, 'dd MMM yyyy')}</p>
      ),
    },
    {
      header: 'Project / Output',
      accessorKey: 'projects.name',
      cell: ({ row }) => (
        <div className='flex w-28 flex-col gap-1'>
          <p
            className='truncate font-medium'
            title={row.original.projects?.name}
          >
            {row.original.projects?.name}
          </p>
          <HoverCard>
            <HoverCardTrigger>
              {row.original.output_measurables?.code}
            </HoverCardTrigger>
            <HoverCardContent>
              {row.original.output_measurables?.description}
            </HoverCardContent>
          </HoverCard>
        </div>
      ),
    },

    {
      header: 'Impact Indicator',
      accessorKey: 'impact_indicators.indicator_code',
      cell: ({ row }) => (
        <HoverCard>
          <HoverCardTrigger>
            {row.original.impact_indicators?.indicator_code}
          </HoverCardTrigger>
          <HoverCardContent>
            {row.original.impact_indicators?.indicator_title}
          </HoverCardContent>
        </HoverCard>
      ),
    },
    {
      header: 'Update Type',
      accessorKey: 'type',
    },
    {
      header: 'Description',
      accessorKey: 'description',
      cell: ({ row }) => (
        <div className='flex flex-col gap-1'>
          <p className='' title={row.original.description}>
            {row.original.description}
          </p>

          {row.original.link && (
            <p className='text-blue-400 hover:underline'>
              <a href={row.original.link} target='_blank'>
                View linked evidence
              </a>
            </p>
          )}
        </div>
      ),
    },
    {
      header: 'Impact',
      accessorKey: 'value',
      cell: ({ row }) => {
        const value = row.original.value;
        const unit = row.original.impact_indicators?.indicator_unit ?? '';
        return (
          <p
            className='w-36 truncate'
            title={value ? `${value.toLocaleString()} ${unit}` : ''}
          >
            {value ? `${value.toLocaleString()} ${unit}` : ''}
          </p>
        );
      },
    },
    {
      header: 'Verified',
      accessorKey: 'verified',
    },
    {
      header: 'Duplicate',
      accessorKey: 'duplicate',
    },
    {
      header: 'Valid',
      accessorKey: 'valid',
    },
    {
      header: 'Admin Reviewed',
      accessorKey: 'admin_reviewed',
    },
    {
      header: 'Review note',
      accessorKey: 'review_note',
    },
  ];

  const table = useReactTable({
    data: updates,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  console.log(updates[0]);

  return (
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
                  <TableCell key={cell.id} className='align-baseline text-xs'>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className='h-24 text-center'>
                No items match the selected filters
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
