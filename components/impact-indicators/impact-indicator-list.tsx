'use client';

import { ImpactIndicatorSummary } from '@/utils/types';
import { useQuery } from '@tanstack/react-query';
import { fetchImpactIndicators } from './server-actions';
import { DataTable } from '../data-tables/data-table';
import { columns } from './columns';

export default function ImpactIndicatorList() {
  const { data: impactIndicators, error } = useQuery({
    queryKey: ['impact-indicators'],
    queryFn: fetchImpactIndicators,
  });

  if (error) {
    return <p>{(error as Error).message}</p>;
  }

  if (!impactIndicators) {
    return (
      <p className='flex h-[500px] w-full items-center justify-center'>
        Loading impact indicators...
      </p>
    );
  }

  return (
    <DataTable<ImpactIndicatorSummary>
      data={impactIndicators}
      columns={columns}
      filterableColumns={[
        {
          id: 'indicator_title',
          label: 'Search indicators',
          type: 'text',
        },
      ]}
      enableExport
    />
  );
}
