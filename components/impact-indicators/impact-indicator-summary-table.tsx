'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function ImpactIndicatorSummaryTable({
  projectSummaries,
}: {
  projectSummaries: any[];
}) {
  return (
    <Table className='w-full rounded-lg border'>
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
  );
}
