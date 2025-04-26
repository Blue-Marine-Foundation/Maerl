'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { fetchLogframe } from '@/components/logframe/server-actions';
import { extractOutputCodeNumber } from '@/components/logframe/extractOutputCodeNumber';
import TheoryOfChangeSkeleton from '@/components/logframe/theory-of-change-skeleton';
import OutputCardLogframe from '@/components/logframe/output-card-logframe';

export default function TheoryOfChangePage() {
  const { slug } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ['logframe', slug],
    queryFn: () => fetchLogframe(slug as string),
  });

  if (isLoading) {
    return <TheoryOfChangeSkeleton />;
  }

  if (error) {
    return <div>Error: {(error as Error).message}</div>;
  }

  const outputs = (data?.data?.outputs || [])
    .sort(
      (a, b) =>
        extractOutputCodeNumber(a.code) - extractOutputCodeNumber(b.code),
    )
    .filter(
      (output) => !output.code.startsWith('U') && output.archived === true,
    );

  const projectId = data?.data?.id;

  console.log(outputs);

  return (
    <div className='flex w-full flex-col text-sm'>
      <h2 className='mb-8 text-xl font-semibold'>Archived outputs</h2>
      {outputs.map((output) => (
        <div key={output.id} id={`output-${output.id}`}>
          <OutputCardLogframe output={output} projectId={projectId} canEdit />
        </div>
      ))}
      {outputs.length === 0 && (
        <div className='rounded-md border p-4 py-12 text-center text-sm text-muted-foreground'>
          No archived outputs for this project
        </div>
      )}
    </div>
  );
}
