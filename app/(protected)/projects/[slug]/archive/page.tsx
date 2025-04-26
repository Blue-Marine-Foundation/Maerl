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
    .filter((output) => !output.code.startsWith('U'));
  const projectId = data?.data?.id;

  console.log(outputs);

  return (
    <div className='-mt-4 flex w-full flex-col text-sm'>
      {outputs.map((output) => (
        <div key={output.id} id={`output-${output.id}`}>
          <OutputCardLogframe output={output} projectId={projectId} canEdit />
        </div>
      ))}
    </div>
  );
}
