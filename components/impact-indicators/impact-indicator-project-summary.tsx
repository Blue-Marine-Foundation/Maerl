'use client';

import * as d3 from 'd3';
import { useImpactIndicatorProjectSummaries } from '@/hooks/use-impact-indicator-project-summaries';
import FeatureCard from '@/components/ui/feature-card';
import { LoadingStateCard, ErrorStateCard } from '../base-states/base-states';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import CopyToCsvButton from '@/components/data-tables/export-data';

export default function ImpactIndicatorProjectSummary({ id }: { id: string }) {
  const { projectSummaries, error, isLoading } =
    useImpactIndicatorProjectSummaries(id);

  if (isLoading) {
    return <LoadingStateCard title='Loading project summaries...' />;
  }

  if (error) {
    return <ErrorStateCard errorMessage={error.message} />;
  }

  return (
    <FeatureCard className='gap-0 p-0'>
      <div className='flex items-center gap-4 p-4'>
        <p>Data from {projectSummaries.length} projects</p>
        <CopyToCsvButton
          data={projectSummaries}
          includeHeaders={true}
          label='Copy'
        />
      </div>
      <Table className='w-full'>
        <TableHeader>
          <TableRow>
            <TableHead>Project</TableHead>
            <TableHead className='text-right'>Progress Updates</TableHead>
            <TableHead className='text-right'>Impact Updates</TableHead>
            <TableHead className='text-right'>Value</TableHead>
            <TableHead>Unit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className='font-bold'>
            <TableCell>Total</TableCell>
            <TableCell className='text-right'>
              {d3.sum(projectSummaries, (d) => d.progressUpdatesCount || 0)}
            </TableCell>
            <TableCell className='text-right'>
              {d3.sum(projectSummaries, (d) => d.impactUpdatesCount || 0)}
            </TableCell>
            <TableCell className='text-right'>
              {d3.format(',')(d3.sum(projectSummaries, (d) => d.valueSum || 0))}
            </TableCell>
            <TableCell>{projectSummaries[0]?.unit}</TableCell>
          </TableRow>
          {projectSummaries &&
            projectSummaries.length > 0 &&
            projectSummaries.map((summary) => (
              <TableRow key={summary.name}>
                <TableCell>{summary.name}</TableCell>
                <TableCell className='text-right'>
                  {summary.progressUpdatesCount}
                </TableCell>
                <TableCell className='text-right'>
                  {summary.impactUpdatesCount}
                </TableCell>
                <TableCell className='text-right'>{summary.valueSum}</TableCell>
                <TableCell>{summary.unit}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </FeatureCard>
  );
}
