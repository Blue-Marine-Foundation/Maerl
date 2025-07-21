'use client';

import {
  ErrorStateCard,
  LoadingStateCard,
} from '@/components/base-states/base-states';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useProjectImpacts } from '@/hooks/use-project-impact';
import SetDateRange from '@/components/date-filtering/set-date-range';
import { cn } from '@/utils/cn';
import { useParams } from 'next/navigation';

export default function ImpactPage() {
  const { slug } = useParams();

  const { impactIndicatorSummaries, isLoading, error } = useProjectImpacts(
    slug as string,
  );

  if (isLoading) {
    return <LoadingStateCard title='Impact Data' />;
  }

  if (error) {
    return (
      <ErrorStateCard
        title='Error loading impact data'
        errorMessage={error.message}
      />
    );
  }

  const columns = [
    {
      heading: 'Code',
      textAlign: 'text-left',
    },
    {
      heading: 'Title',
      textAlign: 'text-left',
    },
    {
      heading: 'No. Updates',
      textAlign: 'text-right',
    },
    {
      heading: 'Total impact',
      textAlign: 'text-right',
    },
    {
      heading: '',
      textAlign: 'text-left',
    },
  ];

  return (
    <Card>
      <CardHeader className='p-4'>
        <div className='flex items-start justify-between gap-4'>
          <div>
            <h3 className='text-xl font-semibold'>Project Impact Summary</h3>
            <p className='text-muted-foreground'>
              Contributions to {impactIndicatorSummaries.length} impact
              indicators
            </p>
          </div>

          <SetDateRange />
        </div>
      </CardHeader>
      <CardContent className='p-0'>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={column.heading}
                  className={cn(column.textAlign)}
                >
                  {column.heading}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {impactIndicatorSummaries.map(
              ({
                impactIndicatorId,
                impactIndicatorCode,
                impactIndicatorTitle,
                impactIndicatorUnit,
                count,
                value,
              }) => (
                <TableRow key={impactIndicatorId}>
                  <TableCell>{impactIndicatorCode}</TableCell>
                  <TableCell>{impactIndicatorTitle}</TableCell>
                  <TableCell className='w-32 text-right'>{count}</TableCell>
                  <TableCell className='w-32 text-right'>
                    {value.toLocaleString()}
                  </TableCell>
                  <TableCell className='w-96'>{impactIndicatorUnit}</TableCell>
                </TableRow>
              ),
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
