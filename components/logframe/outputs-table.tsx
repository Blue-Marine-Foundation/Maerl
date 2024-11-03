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
import { Badge } from '@/components/ui/badge';
import ActionButton from '../ui/action-button';
import OutputForm from './output-form';
import Link from 'next/link';
import { useParams } from 'next/navigation';

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
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => {
        const outputNumber = row.original.code.slice(2);
        return (
          <Link
            href={`/projects/${slug}/logframe/output/${outputNumber}`}
            className='hover:underline'
          >
            {row.getValue('description')}
          </Link>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        return (
          <div className='flex w-24'>
            <Badge variant='default'>{row.original.status}</Badge>
          </div>
        );
      },
    },
    {
      accessorKey: 'output_measurables',
      header: 'Indicators',
      cell: ({ row }) => {
        const measurables = row.original.output_measurables || [];
        return <span>{measurables.length}</span>;
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
