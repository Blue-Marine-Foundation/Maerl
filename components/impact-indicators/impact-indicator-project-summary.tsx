'use client';

import * as d3 from 'd3';
import { useImpactIndicatorProjectSummaries } from '@/hooks/use-impact-indicator-project-summaries';
import FeatureCard from '@/components/ui/feature-card';

export default function ImpactIndicatorProjectSummary({ id }: { id: string }) {
  const { projectSummaries, error, isLoading } =
    useImpactIndicatorProjectSummaries(id);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <FeatureCard>
      <div className=''>
        {projectSummaries &&
          projectSummaries.length > 0 &&
          projectSummaries.map((summary) => (
            <div key={summary.name} className='grid grid-cols-5 gap-4'>
              <p>{summary.name}</p>
              <p>{summary.progressUpdatesCount}</p>
              <p>{summary.impactUpdatesCount}</p>
              <p>{summary.valueSum}</p>
              <p>{summary.unit}</p>
            </div>
          ))}
        <div className='grid grid-cols-5 gap-4'>
          <p>Total</p>
          <p>{d3.sum(projectSummaries, (d) => d.progressUpdatesCount || 0)}</p>
          <p>{d3.sum(projectSummaries, (d) => d.impactUpdatesCount || 0)}</p>
          <p>
            {d3.format(',')(d3.sum(projectSummaries, (d) => d.valueSum || 0))}
          </p>
          <p>{projectSummaries[0]?.unit}</p>
        </div>
      </div>
    </FeatureCard>
  );
}
