'use client';

import { useQuery } from '@tanstack/react-query';
import { columns } from './updates-table-columns';
import { fetchUpdates, type UpdateAuthorScope } from './server-actions';
import useUrlDateState from '../date-filtering/use-url-date-state';
import { DataTable } from '../data-tables/data-table';
import { Update } from '@/utils/types';
import FeatureCard from '../ui/feature-card';

const filterableColumns = [
  { id: 'project', label: 'Project' },
  { id: 'impact_indicator', label: 'Impact Indicator' },
  { id: 'type', label: 'Update Type' },
];

export default function UpdatesDataTable({
  authorScope = 'all',
}: {
  authorScope?: UpdateAuthorScope;
}) {
  const dateRange = useUrlDateState();

  const { data, error } = useQuery({
    queryKey: ['updates', dateRange, authorScope],
    queryFn: () => fetchUpdates(dateRange, undefined, authorScope),
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
    <FeatureCard className='min-w-0'>
      <DataTable<Update>
        data={data}
        columns={columns}
        filterableColumns={filterableColumns}
        enableDateFilter
        enableExport
      />
    </FeatureCard>
  );
}
