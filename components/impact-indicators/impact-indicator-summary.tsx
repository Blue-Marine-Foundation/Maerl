'use client';

import SetDateRange from '@/components/date-filtering/set-date-range';
import { useImpactIndicatorProjectSummaries } from '@/hooks/use-impact-indicator-project-summaries';
import CopyToCsvButton from '@/components/data-tables/export-data';
import * as d3 from 'd3';
import ImpactIndicatorSummaryTable from './impact-indicator-summary-table';
import SetUrlProjects from '@/components/set-url-projects/set-url-projects';

export default function ImpactIndicatorSummary({ id }: { id: string }) {
  const { projectSummaries, error, isLoading } =
    useImpactIndicatorProjectSummaries(id);

  const projects = projectSummaries?.map((summary) => summary.name);

  return (
    <div className='space-y-4'>
      <div className='flex items-start justify-between gap-2'>
        <div className='space-y-2'>
          <h3 className='text-lg font-bold'>
            {d3.format(',')(d3.sum(projectSummaries, (d) => d.valueSum || 0))}{' '}
            {projectSummaries[0]?.unit}
          </h3>
          <p className='text-muted-foreground'>
            Data from{' '}
            {d3.sum(projectSummaries, (d) => d.impactUpdatesCount || 0)} impact
            updates on {projectSummaries.length} projects
          </p>
          <CopyToCsvButton
            data={projectSummaries}
            includeHeaders={true}
            label='Copy'
          />
        </div>
        <div className='flex items-center justify-end gap-4'>
          {isLoading && <div>Loading filters</div>}
          {error && <div>Error loading filters</div>}
          {projects && <SetUrlProjects projects={projects} />}

          <SetDateRange />
        </div>
      </div>

      {projectSummaries && projectSummaries.length > 0 && (
        <ImpactIndicatorSummaryTable projectSummaries={projectSummaries} />
      )}

      {projectSummaries && projectSummaries.length === 0 && (
        <p className='text-muted-foreground'>
          No data available for this impact indicator. Try updating the selected
          date range.
        </p>
      )}
    </div>
  );
}
