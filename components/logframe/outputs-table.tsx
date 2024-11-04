'use client';

import { useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
} from '@tanstack/react-table';
import { Output } from '@/utils/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge, BadgeProps } from '@/components/ui/badge';
import ActionButton from '../ui/action-button';
import OutputForm from './output-form';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { timeFormat } from 'd3';

interface OutputsTableProps {
  outputs: Output[];
  projectId: number;
}

export default function OutputsTable({
  outputs,
  projectId,
}: OutputsTableProps) {
  const { slug } = useParams();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedOutput, setSelectedOutput] = useState<Output | null>(null);

  const columns: ColumnDef<Output>[] = [
    {
      accessorKey: 'code',
      header: 'Code',
      cell: ({ row }) => (
        <Badge variant='outline'>{row.getValue('code')}</Badge>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const badgeVariant = row.original.status
          ? (row.original.status
              .toLowerCase()
              .replace(' ', '_') as BadgeProps['variant'])
          : 'default';
        return (
          <div className='flex w-24'>
            <Badge variant={badgeVariant}>{row.original.status}</Badge>
          </div>
        );
      },
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => {
        const outputNumber = row.original.code.slice(2);
        return (
          <p className='max-w-prose'>
            <Link
              href={`/projects/${slug}/logframe/output/${outputNumber}`}
              className='hover:underline'
            >
              {row.getValue('description')}
            </Link>
          </p>
        );
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Last updated',
      cell: ({ row }) => (
        <p className='w-28'>
          {timeFormat('%d %b %Y')(new Date(row.original.created_at))}
        </p>
      ),
    },
    {
      accessorKey: 'output_measurables',
      header: 'Indicators',
      cell: ({ row }) => {
        const measurables = row.original.output_measurables || [];
        return <p className='text-right'>{measurables.length}</p>;
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const outputCode = row.original.code;
        if (!outputCode.startsWith('U')) {
          return (
            <div className='flex justify-end'>
              <ActionButton
                action='edit'
                variant='icon'
                onClick={() => {
                  setSelectedOutput(row.original);
                  setIsDialogOpen(true);
                }}
              />
            </div>
          );
        }
        return null;
      },
    },
  ];

  const table = useReactTable({
    data: outputs,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  return (
    <div className='flex flex-col gap-4'>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
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
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
                  No outputs found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <OutputForm
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedOutput(null);
        }}
        output={selectedOutput}
        outcomeMeasurableId={selectedOutput?.outcome_measurable_id || 0}
        projectId={projectId}
      />
    </div>
  );
}
