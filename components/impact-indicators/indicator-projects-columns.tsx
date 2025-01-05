import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import * as d3 from 'd3';

interface ProjectRow {
  name: string;
  slug: string;
  count: number;
  valueSum: number;
  unit: string;
}

export const columns: ColumnDef<ProjectRow>[] = [
  {
    header: 'Project',
    accessorKey: 'name',
    cell: ({ row }: { row: { original: ProjectRow } }) => {
      return (
        <Link href={`/projects/${row.original.slug}`} className=''>
          {row.original.name}
        </Link>
      );
    },
  },
  {
    header: 'Count',
    accessorKey: 'count',
  },
  {
    header: 'Total Value',
    accessorKey: 'valueSum',
    cell: ({ row }) => {
      return d3.format(',')(row.getValue('valueSum'));
    },
  },
  {
    header: 'Unit',
    accessorKey: 'unit',
    cell: ({ row }) => {
      return row.getValue('unit');
    },
  },
];
