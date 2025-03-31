'use client';

import { ImpactIndicatorSummary } from '@/utils/types';
import { ColumnDef } from '@tanstack/react-table';
import * as d3 from 'd3';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const IndicatorTitleCell = ({ row }: { row: any }) => {
  const code = row.original.indicator_code;
  const searchParams = useSearchParams();
  const hasSearchParams = searchParams && searchParams.toString().length > 0;

  return (
    <div
      className={`max-w-prose ${
        code.length < 2 && 'font-medium'
      } ${code.length < 4 && 'text-muted-foreground'}`}
    >
      <Link
        href={`/impactindicators/${row.original.impact_indicator_id}${
          hasSearchParams ? `?${searchParams.toString()}` : ''
        }`}
        className='hover:underline'
      >
        {row.getValue('indicator_title')}
      </Link>
    </div>
  );
};

export const columns: ColumnDef<ImpactIndicatorSummary>[] = [
  {
    accessorKey: 'indicator_code',
    header: 'Indicator Code',
    cell: ({ row }) => {
      const code = row.getValue('indicator_code') as string;
      return (
        <div
          className={`max-w-20 text-right ${
            code.length < 2 && 'font-medium'
          } ${code.length < 4 && 'text-muted-foreground'}`}
        >
          {code}
        </div>
      );
    },
  },
  {
    accessorKey: 'indicator_title',
    header: 'Indicator Title',
    filterFn: (row, columnId, filterValue) => {
      const title = row.getValue(columnId) as string;
      return title
        .toLowerCase()
        .includes((filterValue as string).toLowerCase());
    },
    cell: ({ row }) => <IndicatorTitleCell row={row} />,
  },
  {
    accessorKey: 'valid_updates',
    header: 'Valid Updates',
    cell: ({ row }) => {
      const code = row.original.indicator_code;
      if (code.length <= 3) return null;
      return <div className='text-right'>{row.getValue('valid_updates')}</div>;
    },
  },
  {
    accessorKey: 'total_value',
    header: 'Total Value',
    cell: ({ row }) => {
      const code = row.original.indicator_code;
      if (code.length <= 3) return null;
      return (
        <div className='text-right'>
          {d3.format(',.0f')(row.getValue('total_value'))}
        </div>
      );
    },
  },
  {
    accessorKey: 'indicator_unit',
    header: 'Unit',
    cell: ({ row }) => {
      const code = row.original.indicator_code;
      if (code.length <= 3) return null;
      return (
        <div className='text-muted-foreground'>
          {row.getValue('indicator_unit')}
        </div>
      );
    },
  },
];
