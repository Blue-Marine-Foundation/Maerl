'use client';

import { useQuery } from '@tanstack/react-query';
import { columns } from './updates-table-columns';
import { fetchUpdates } from './server-actions';
import useUrlDateState from '../date-filtering/use-url-date-state';
import { DataTable } from '../data-tables/data-table';
import { flattenUpdates } from './flatten-updates';
import { Update } from '@/utils/types';

const filterableColumns = [
  { id: 'impact_indicator', label: 'Impact Indicator' },
  { id: 'type', label: 'Update Type' },
];

export default function ProjectUpdatesDataTable({
  projectId,
}: {
  projectId: number;
}) {
  const dateRange = useUrlDateState();

  const { data, error } = useQuery({
    queryKey: ['updates', dateRange],
    queryFn: () => fetchUpdates(dateRange, projectId),
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
