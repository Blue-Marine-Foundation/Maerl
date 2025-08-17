'use client';

import { DataTable } from '@/components/data-tables/data-table';
import { columns } from '@/components/impact-indicators/indicator-updates-columns';
import { Update } from '@/utils/types';
import { useParams } from 'next/navigation';
import useUrlDateState from '@/components/date-filtering/use-url-date-state';
import FeatureCard from '../ui/feature-card';
import { useImpactIndicatorUpdates } from '@/hooks/use-impact-indicator-updates';

export default function IndicatorUpdates() {
  const { id } = useParams();
  const dateRange = useUrlDateState();

  const { data, error, isLoading } = useImpactIndicatorUpdates(id as string);

  if (isLoading) {
    return <div>Loading impact indicator...</div>;
  }

  if (error) {
    return (
      <div>Error loading impact indicator: {(error as Error).message}</div>
    );
  }

  const filterableColumns = [
    { id: 'project', label: 'Project' },
    { id: 'type', label: 'Update Type' },
  ];

  return (
    <div className='flex flex-col gap-8'>
      <FeatureCard>
        <DataTable
          data={data as Update[]}
          columns={columns}
          filterableColumns={filterableColumns}
          enableDateFilter={false}
          enableExport
        />
      </FeatureCard>
    </div>
  );
}
