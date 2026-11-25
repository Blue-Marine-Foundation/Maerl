'use client';

import { DataTable } from '@/components/data-tables/data-table';
import { columns } from '@/components/impact-indicators/indicator-updates-columns';
import { Update } from '@/utils/types';
import { useParams } from 'next/navigation';
import { useImpactIndicatorUpdates } from '@/hooks/use-impact-indicator-updates';
import { useUrlProjects } from '@/hooks/use-url-projects';
import { isEligibleImpactIndicatorUpdate } from '@/utils/update-review';

export default function IndicatorUpdates() {
  const { id } = useParams();

  const { data, error, isLoading } = useImpactIndicatorUpdates(id as string);

  const eligibleUpdates = (data || []).filter(isEligibleImpactIndicatorUpdate);

  const projects = eligibleUpdates.map((d) => d.projects.name);

  const projectFilter = useUrlProjects(projects);

  if (isLoading) {
    return <div>Loading impact indicator...</div>;
  }

  if (error) {
    return (
      <div>Error loading impact indicator: {(error as Error).message}</div>
    );
  }

  const filteredData = eligibleUpdates.filter((d) =>
    projectFilter.includes(d.projects.name),
  );

  const filterableColumns = [{ id: 'type', label: 'Update Type' }];

  return (
    <div className='space-y-4'>
      <h3 className='text-lg font-bold'>Impact Updates</h3>
      <DataTable
        data={filteredData as Update[]}
        columns={columns}
        filterableColumns={filterableColumns}
        enableDateFilter={false}
        enableExport
      />
    </div>
  );
}
