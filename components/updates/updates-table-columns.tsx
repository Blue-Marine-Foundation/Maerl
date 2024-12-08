import { Update } from '@/utils/types';
import { ColumnDef } from '@tanstack/react-table';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '../ui/hover-card';
import Link from 'next/link';
import * as d3 from 'd3';
import { ArrowUpRight } from 'lucide-react';

export const columns: ColumnDef<Update>[] = [
  {
    header: 'Date',
    accessorKey: 'date',
    accessorFn: (row) => row.date,
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue.length === 0) return true;
      return filterValue.includes(row.getValue(columnId));
    },
  },
  {
    header: 'Project',
    accessorKey: 'project',
    accessorFn: (row) => row.projects?.name,
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue.length === 0) return true;
      return filterValue.includes(row.getValue(columnId));
    },
    cell: ({ row }) => {
      return (
        <Link
          href={`/projects/${row.original.projects?.slug}`}
          className='block max-w-[150px] truncate'
        >
          {row.original.projects?.name}
        </Link>
      );
    },
  },
  {
    header: 'Output Indicator',
    accessorKey: 'output_measurable',
    accessorFn: (row) => row.output_measurables?.code,
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue.length === 0) return true;
      return filterValue.includes(row.getValue(columnId));
    },
    cell: ({ row }) => {
      return (
        <HoverCard>
          <HoverCardTrigger>
            {row.original.output_measurables?.code}
          </HoverCardTrigger>
          <HoverCardContent>
            <p>{row.original.output_measurables?.description}</p>
          </HoverCardContent>
        </HoverCard>
      );
    },
  },
  {
    header: 'Impact Indicator',
    accessorKey: 'impact_indicator',
    accessorFn: (row) => row.impact_indicators?.indicator_code,
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue.length === 0) return true;
      return filterValue.includes(row.getValue(columnId));
    },
    cell: ({ row }) => {
      return (
        <HoverCard>
          <HoverCardTrigger>
            {row.original.impact_indicators?.indicator_code}
          </HoverCardTrigger>
          <HoverCardContent>
            <p>{row.original.impact_indicators?.indicator_title}</p>
          </HoverCardContent>
        </HoverCard>
      );
    },
  },
  {
    header: 'Type',
    accessorKey: 'type',
    accessorFn: (row) => row.type,
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue.length === 0) return true;
      return filterValue.includes(row.getValue(columnId));
    },
  },
  {
    header: 'Description',
    accessorKey: 'description',
    accessorFn: (row) => row.description,
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue.length === 0) return true;
      return filterValue.includes(row.getValue(columnId));
    },
    cell: ({ row }) => {
      return <p className='max-w-prose'>{row.getValue('description')}</p>;
    },
  },
  {
    header: 'Impact',
    accessorKey: 'value',
    accessorFn: (row) => row.value,
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue.length === 0) return true;
      return filterValue.includes(row.getValue(columnId));
    },
    cell: ({ row }) => {
      return (
        <div className='flex flex-col gap-1'>
          <p className='max-w-prose'>
            {row.original.value &&
              d3.format(',.0f')(row.original.value) +
                ' ' +
                row.original.impact_indicators?.indicator_unit}
          </p>
          {row.original.link && (
            <p className='text-sky-500'>
              <Link href={row.original.link} target='_blank'>
                Linked evidence <ArrowUpRight className='inline h-3 w-3' />
              </Link>
            </p>
          )}
        </div>
      );
    },
  },
  {
    header: 'Posted by',
    accessorKey: 'posted_by',
    accessorFn: (row) => row.users?.first_name + ' ' + row.users?.last_name,
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue.length === 0) return true;
      return filterValue.includes(row.getValue(columnId));
    },
    cell: ({ row }) => {
      return (
        <p className='max-w-prose'>
          {row.original.users?.first_name} {row.original.users?.last_name}
        </p>
      );
    },
  },
];
