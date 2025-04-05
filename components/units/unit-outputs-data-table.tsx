'use client';

import { DataTable } from '../data-tables/data-table';
import Link from 'next/link';
import { ColumnCount } from '@/components/data-tables/column-count';
import { Table } from '@tanstack/react-table';

type OutputRow = {
  id: string;
  unit: string;
  projectName: string;
  projectSlug: string;
  projectType: string;
  outputNumber: number;
  outputStatus: string;
  outputMeasurableCode: string;
  outputMeasurableDescription: string;
  outputMeasurableTarget: number | null;
  outputMeasurableUnit: string | null;
  outputMeasurableValue: number | null;
};

const columns = [
  {
    accessorKey: 'projectName',
    header: 'Project Name',
    cell: ({ row }: { row: any }) => (
      <Link href={`/projects/${row.original.projectSlug}`}>
        {row.original.projectName}
      </Link>
    ),
  },
  {
    accessorKey: 'outputNumber',
    header: 'Output',
    meta: {
      align: 'right',
    },
    cell: ({ row }: { row: any }) => (
      <span>Output {row.original.outputNumber}</span>
    ),
  },
  {
    accessorKey: 'outputStatus',
    header: 'Output Status',
  },
  {
    accessorKey: 'outputMeasurableCode',
    header: 'Output Indicator',
    cell: ({ row }: { row: any }) => (
      <Link
        href={`/projects/${row.original.projectSlug}/logframe#output-${row.original.outputId}`}
        className='flex items-center gap-1'
      >
        {row.original.outputMeasurableCode}
      </Link>
    ),
  },
  {
    accessorKey: 'outputMeasurableDescription',
    header: 'Output Description',
    cell: ({ row }: { row: any }) => (
      <Link
        href={`/projects/${row.original.projectSlug}/logframe#output-${row.original.outputId}`}
        className='flex items-center gap-1'
      >
        {row.original.outputMeasurableDescription}
      </Link>
    ),
  },
  {
    accessorKey: 'outputMeasurableTarget',
    header: 'Target',
    cell: ({ row }: { row: any }) => (
      <span>
        {row.original.outputMeasurableTarget}{' '}
        {row.original.outputMeasurableUnit}
      </span>
    ),
  },
  {
    accessorKey: 'outputMeasurableValue',
    header: 'Value',
  },
];

const filterableColumns = [{ id: 'projectName', label: 'Project' }];

export default function UnitOutputsDataTable({ data }: { data: OutputRow[] }) {
  return (
    <DataTable<OutputRow>
      data={data}
      columns={columns}
      filterableColumns={filterableColumns}
      enableExport
      renderColumnCount={(table: Table<OutputRow>, columnId: string) => {
        const shouldShowCount = [
          'projectName',
          'outputMeasurableCode',
        ].includes(columnId);
        return shouldShowCount ? (
          <ColumnCount table={table} columnId={columnId} />
        ) : null;
      }}
    />
  );
}
