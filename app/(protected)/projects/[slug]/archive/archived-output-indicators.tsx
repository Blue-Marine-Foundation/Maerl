'use client';

import { useQuery } from '@tanstack/react-query';
import { getArchivedOutputIndicators } from './server-actions';
import TheoryOfChangeSkeleton from '@/components/logframe/theory-of-change-skeleton';
import OutputIndicatorsDetailsTable from '@/components/logframe/output-indicators-table';
import { OutputMeasurable } from '@/utils/types';

export default function ArchivedOutputIndicators({ slug }: { slug: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['archived-output-indicators', slug],
    queryFn: () => getArchivedOutputIndicators(slug as string),
  });

  if (isLoading) {
    return <TheoryOfChangeSkeleton />;
  }

  if (error) {
    return (
      <div className='rounded-md border bg-card p-4'>
        Error: {(error as Error).message}
      </div>
    );
  }

  const projectId = data?.[0]?.project_id;

  if (data?.length === 0) {
    return (
      <div className='rounded-md border p-4 py-12 text-center text-sm text-muted-foreground'>
        No archived output indicators for this project
      </div>
    );
  }

  return (
    <div className='flex w-full flex-col text-sm'>
      <OutputIndicatorsDetailsTable
        measurables={data as OutputMeasurable[]}
        outputId={data?.[0]?.output_id}
        projectId={projectId}
        outputCode={data?.[0]?.output_code}
      />
    </div>
  );
}
