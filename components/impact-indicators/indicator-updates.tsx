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

  const filterableColumns = [{ id: 'type', label: 'Update Type' }];

  return (
    <div className='space-y-4'>
      <h3 className='text-lg font-bold'>Impact Updates</h3>
      <DataTable
        data={data as Update[]}
        columns={columns}
        filterableColumns={filterableColumns}
        enableDateFilter={false}
        enableExport
      />
    </div>
  );
}
