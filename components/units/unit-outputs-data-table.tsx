'use client';

/**
 * NOTE: This page is a proof of concept with mock data
 * and needs to be revisited after db updates done
 * */

import { DataTable } from '../data-tables/data-table';
import Link from 'next/link';

type OutputRow = {
  id: string;
  project: string;
  projectSlug: string;
  outputId: number;
  outputCode: string;
  outputDescription: string;
  indicator: string;
  target: number | null;
  unit: string | null;
};

const columns = [
  {
    accessorKey: 'project',
    header: 'Project',
  },
  {
    accessorKey: 'output',
    header: 'Output',
    cell: ({ row }: { row: any }) => (
      <Link
        href={`/projects/${row.original.projectSlug}/logframe#output-${row.original.outputId}`}
        className='text-blue-600 hover:underline'
      >
        {`Output ${row.original.outputCode}: ${row.original.outputDescription}`}
      </Link>
    ),
  },
  {
    accessorKey: 'indicator',
    header: 'Output Indicator',
    cell: ({ row }: { row: any }) => (
      <div>
        {row.original.indicator}
        {row.original.target && (
          <span className='text-gray-600'>
            {' '}
            (Target: {row.original.target} {row.original.unit})
          </span>
        )}
      </div>
    ),
  },
];

const filterableColumns = [{ id: 'project', label: 'Project' }];

export default function UnitOutputsDataTable({ data }: { data: OutputRow[] }) {
  return (
    <DataTable<OutputRow>
      data={data}
      columns={columns}
      filterableColumns={filterableColumns}
      enableExport
    />
  );
}
