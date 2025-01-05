'use client';

import { DataTable } from '@/components/data-tables/data-table';
import { columns } from '@/components/impact-indicators/indicator-updates-columns';
import { useQuery } from '@tanstack/react-query';
import { fetchImpactIndicatorUpdates } from '@/components/impact-indicators/server-actions';
import { Update } from '@/utils/types';
import { useParams } from 'next/navigation';
import useUrlDateState from '@/components/date-filtering/use-url-date-state';
import FeatureCard from '../ui/feature-card';
import { rollup } from 'd3-array';
import * as d3 from 'd3';
import { columns as projectSummariesColumns } from '@/components/impact-indicators/indicator-projects-columns';

export default function IndicatorUpdates() {
  const { id } = useParams();
  const dateRange = useUrlDateState();

  const { data, error, isLoading } = useQuery({
    queryKey: ['impact-indicator', id, dateRange],
    queryFn: () =>
      fetchImpactIndicatorUpdates(id as string, dateRange.from, dateRange.to),
  });

  if (isLoading) {
    return <div>Loading impact indicator...</div>;
  }

  if (error) {
    return (
      <div>Error loading impact indicator: {(error as Error).message}</div>
    );
  }

  const project_summaries = Array.from(
    rollup(
      data || [],
      (v) => ({
        slug: v[0].projects?.slug,
        count: v.length,
        valueSum: d3.sum(v, (d) => d.value || 0),
        unit: v[0].impact_indicators?.indicator_unit,
      }),
      (d) => d.projects.name,
    ),
    ([name, values]) => ({
      name,
      ...values,
    }),
  ).sort((a, b) => (a.name || '').localeCompare(b.name || ''));

  const filterableColumns = [
    { id: 'project', label: 'Project' },
    { id: 'type', label: 'Update Type' },
  ];

  return (
    <div className='flex flex-col gap-8'>
      <div className='flex items-start justify-between gap-4'>
        <div className='sticky top-8 w-1/4 rounded-md bg-card p-4'>
          <div className='flex flex-col gap-4'>
            <h3 className='text-sm font-medium text-muted-foreground'>
              Total value
            </h3>
            <p className='text-balance text-sm'>{project_summaries[0]?.unit}</p>
            <h2 className='text-right text-3xl font-bold'>
              {d3.format(',')(
                d3.sum(project_summaries, (d) => d.valueSum || 0),
              )}
            </h2>
          </div>
        </div>
        <div className='grow'>
          <FeatureCard>
            <DataTable
              data={project_summaries}
              filterableColumns={[{ id: 'name', label: 'Project' }]}
              columns={projectSummariesColumns}
              enableExport
            />
          </FeatureCard>
        </div>
      </div>
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
