'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchLogframe } from '@/components/logframe/server-actions';
import { extractOutputCodeNumber } from '@/components/logframe/extractOutputCodeNumber';
import OutputCardLogframe from '@/components/logframe/output-card-logframe';
import { LoadingCard } from '@/components/base-states/base-states';

export default function ArchivedOutputs({ slug }: { slug: string }) {
  // Use this queryFn rather than a specific archived output function because the data is most likely already cached
  const { data, isLoading, error } = useQuery({
    queryKey: ['logframe', slug],
    queryFn: () => fetchLogframe(slug as string),
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

  const outputs = (data?.data?.outputs || [])
    .sort(
      (a, b) =>
        extractOutputCodeNumber(a.code) - extractOutputCodeNumber(b.code),
    )
    .filter((output) => output.archived === true);

  const projectId = data?.data?.id;

  if (outputs.length === 0) {
    return (
      <div className='rounded-md border p-4 py-12 text-center text-sm text-muted-foreground'>
        No archived outputs for this project
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {outputs.map((output) => (
        <div key={output.id} id={`output-${output.id}`}>
          <OutputCardLogframe
            output={output}
            projectId={projectId}
            projectSlug={slug as string}
            canEdit
            showIndicator={false}
          />
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
