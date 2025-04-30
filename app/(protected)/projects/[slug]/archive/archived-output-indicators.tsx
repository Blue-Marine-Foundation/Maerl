'use client';

import { useQuery } from '@tanstack/react-query';
import { getArchivedOutputIndicators } from './server-actions';
import OutputIndicatorsDetailsTable from '@/components/logframe/output-indicators-table';
import { OutputMeasurable } from '@/utils/types';
import { Badge } from '@/components/ui/badge';
import { LoadingCard } from '@/components/base-states/base-states';
interface FlatOutputIndicator extends OutputMeasurable {
  projectId: string;
  projectName: string;
  projectSlug: string;
  outputId: string;
  outputCode: string;
  outputDescription: string;
}

export default function ArchivedOutputIndicators({ slug }: { slug: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['archived-output-indicators'],
    queryFn: () => getArchivedOutputIndicators(slug as string),
  });

  if (isLoading) {
    return <LoadingCard />;
  }

  if (error) {
    return (
      <div className='rounded-md border bg-card p-4'>
        Error: {(error as Error).message}
      </div>
    );
  }

  const projectId = data?.[0]?.project_id;

  if (!data || data.length === 0) {
    return (
      <div className='rounded-md border p-4 py-12 text-center text-sm text-muted-foreground'>
        No archived output indicators for this project
      </div>
    );
  }

  const groupedMeasurables = data.reduce(
    (acc, curr) => {
      acc[curr.outputCode] = [...(acc[curr.outputCode] || []), curr];
      return acc;
    },
    {} as Record<string, FlatOutputIndicator[]>,
  );

  return (
    <div className='space-y-6'>
      {Object.entries(groupedMeasurables).map(([outputCode, measurables]) => {
        const typedMeasurables = measurables as FlatOutputIndicator[];
        return (
          <div key={outputCode} className='space-y-4'>
            <div className='flex items-center gap-4'>
              <Badge className='text-lg font-medium'>{outputCode}</Badge>
              <h3 className='font-semibold'>
                {typedMeasurables[0].outputDescription.trim()}
              </h3>
            </div>
            <OutputIndicatorsDetailsTable
              measurables={typedMeasurables}
              outputId={data?.[0]?.output_id}
              projectId={projectId}
              outputCode={outputCode}
              showAddButton={false}
            />
          </div>
        );
      })}
    </div>
  );
}
