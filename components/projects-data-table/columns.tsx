'use client';

import { ColumnDef, FilterFn } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { ProjectMetadata } from '@/utils/types';
import Link from 'next/link';
import ProjectActionButtons from './project-action-buttons';
import { cn } from '@/utils/cn';
const createFilterFn = () => {
  return (row: any, columnId: string, filterValue: string[]) => {
    if (!filterValue || filterValue.length === 0) return false;
    const cellValue = row.getValue(columnId);
    const normalizedValue =
      cellValue === '' || cellValue === null ? 'none' : cellValue;
    return filterValue.includes(normalizedValue);
  };
};

const fuzzyFilter: FilterFn<ProjectMetadata> = (
  row,
  columnId,
  value,
  addMeta,
) => {
  const projectManager = (row.getValue('pm') as string | null) ?? '';
  const support = (row.getValue('support') as string | null) ?? '';
  const searchValue = value.toLowerCase();

  if (!searchValue) return true;

  return (
    projectManager.toLowerCase().includes(searchValue) ||
    support.toLowerCase().includes(searchValue)
  );
};

const listFilterFn: FilterFn<ProjectMetadata> = (
  row,
  columnId,
  filterValue,
) => {
  if (!filterValue) return false;

  const cellValue = row.getValue(columnId) as string | null;
  if (cellValue === null || cellValue === '') {
    return filterValue.includes('None');
  }
  const cellValues = cellValue.split(',').map((item) => item.trim());
  return filterValue.some((filter: string) =>
    filter === 'None' ? cellValues.length === 0 : cellValues.includes(filter),
  );
};

export const columns: ColumnDef<ProjectMetadata>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <button
          className='flex items-center gap-1'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Project
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </button>
      );
    },
    cell: ({ row }) => {
      return (
        <Link
          href={
            row.original.project_type === 'Unit'
              ? `/units/${row.original.slug}`
              : `/projects/${row.original.slug}`
          }
          className='group'
        >
          <p
            className={cn(
              'border-l-2 pl-2',
              row.original.project_type === 'Project' &&
                'border-l-blue-500 group-hover:bg-blue-500/20',
              row.original.project_type === 'Unit led project' &&
                'border-l-yellow-500 group-hover:bg-yellow-500/20',
              row.original.project_type === 'Unit' &&
                'border-l-green-500 group-hover:bg-green-500/20',
            )}
          >
            {row.original.name.slice(0, 25)}
            {row.original.name.length > 25 && '...'}
          </p>
        </Link>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: 'last_updated',
    header: ({ column }) => {
      return (
        <button
          className='flex items-center gap-1'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Updated
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </button>
      );
    },
    cell: ({ row }) => {
      return (
        <p>
          {row.original.last_updated
            ? new Date(row.original.last_updated).toLocaleDateString()
            : ''}
        </p>
      );
    },
  },
  {
    accessorKey: 'project_type',
    header: 'Project Type',
    filterFn: createFilterFn(),
  },
  {
    accessorKey: 'project_status',
    header: 'Status',
    filterFn: createFilterFn(),
  },
  {
    accessorKey: 'project_tier',
    header: 'Tier',
    filterFn: createFilterFn(),
    cell: ({ row }) => {
      const tierMap = {
        t1: 'Tier 1',
        t2: 'Tier 2',
        t3: 'Tier 3',
        t4: 'Tier 4',
      };
      const tier = row.getValue('project_tier') as keyof typeof tierMap;
      return <p className='whitespace-nowrap'>{tier ? tierMap[tier] : ''}</p>;
    },
  },
  {
    accessorKey: 'start_date',
    header: 'Started',
  },

  {
    accessorKey: 'project_country',
    header: 'Country',
  },
  {
    accessorKey: 'regional_strategy',
    header: ({ column }) => {
      return (
        <button
          className='flex items-center gap-1'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Region
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </button>
      );
    },
    cell: ({ row }) => {
      return (
        <p className='whitespace-nowrap'>{row.getValue('regional_strategy')}</p>
      );
    },
    filterFn: createFilterFn(),
  },
  {
    accessorKey: 'pillars',
    header: 'Pillars',
    filterFn: listFilterFn,
  },
  {
    accessorKey: 'pm',
    header: 'PM',
    filterFn: fuzzyFilter,
  },
  {
    accessorKey: 'support',
    header: 'Support',
    filterFn: fuzzyFilter,
  },
  {
    accessorKey: 'unit_requirements',
    header: 'Units',
    cell: ({ row }) => {
      return <p className='max-w-[230px]'>{row.original.unit_requirements}</p>;
    },
    filterFn: listFilterFn,
  },
  {
    accessorKey: 'local_contacts',
    header: 'Local Contacts',
    cell: ({ row }) => {
      return (
        <div className='flex flex-col gap-1'>
          {row.original.local_contacts &&
            row.original.local_contacts.map((contact) => {
              return (
                <p key={contact.organisation}>
                  {contact.organisation ? contact.organisation : contact.name}
                </p>
              );
            })}
        </div>
      );
    },
  },
  {
    accessorKey: 'highlights',
    header: 'Highlights',
  },
  {
    accessorKey: 'current_issues',
    header: 'Current Issues',
  },
  {
    accessorKey: 'proposed_solutions',
    header: 'Proposed Solutions',
  },
  {
    accessorKey: 'board_intervention_required',
    header: 'Board Intervention Required',
  },
  {
    id: 'edit',
    cell: ({ row }) => <ProjectActionButtons project={row.original} />,
    enableHiding: false,
  },
];
