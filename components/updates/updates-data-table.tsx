'use client';

import { useQuery } from '@tanstack/react-query';
import { columns } from './updates-table-columns';
import { fetchUpdates } from './server-actions';
import useUrlDateState from '../date-filtering/use-url-date-state';
import { DataTable } from '../data-tables/data-table';
import { Update } from '@/utils/types';

const filterableColumns = [
  { id: 'project', label: 'Project' },
  { id: 'impact_indicator', label: 'Impact Indicator' },
  { id: 'type', label: 'Update Type' },
];

export default function UpdatesDataTable() {
  const dateRange = useUrlDateState();

  const { data, error } = useQuery({
    queryKey: ['updates', dateRange],
    queryFn: () => fetchUpdates(dateRange),
  });

  if (error) {
    return <p>{error.message}</p>;
  }

  if (!data) {
    return (
      <p className='flex h-[500px] w-full items-center justify-center'>
        Loading updates...
      </p>
    );
  }

  return (
    <DataTable<Update>
      data={data}
      columns={columns}
      filterableColumns={filterableColumns}
      enableDateFilter
      enableExport
    />
  );
}
