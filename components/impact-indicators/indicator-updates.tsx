'use client';

import { DataTable } from '@/components/data-tables/data-table';
import { columns } from '@/components/impact-indicators/indicator-updates-columns';
import { useQuery } from '@tanstack/react-query';
import { fetchImpactIndicatorUpdates } from '@/components/impact-indicators/server-actions';
import { Update } from '@/utils/types';
import { useParams } from 'next/navigation';
import useUrlDateState from '@/components/date-filtering/use-url-date-state';

export default function IndicatorUpdates() {
  const { id } = useParams();
  const dateRange = useUrlDateState();

  const { data, error, isLoading } = useQuery({
    queryKey: ['impact-indicator', id, dateRange],
    queryFn: () => fetchImpactIndicatorUpdates(id as string),
  });

  if (isLoading) {
    return <div>Loading impact indicator...</div>;
  }

  if (error) {
    return (
      <div>Error loading impact indicator: {(error as Error).message}</div>
    );
  }

  const projects = Array.from(
    new Set(data?.map((update: Update) => update.projects?.name)),
  ).sort() as Array<string>;

  const filterableColumns = [
    { id: 'project', label: 'Project' },
    { id: 'type', label: 'Update Type' },
  ];

  return (
    <div className='flex flex-col gap-8'>
      <p>
        {projects.length} projects:{' '}
        {projects.map((project: string) => project).join(', ')}
      </p>
      <DataTable
        data={data as Update[]}
        columns={columns}
        filterableColumns={filterableColumns}
        enableDateFilter
        enableExport
      />
    </div>
  );
}
