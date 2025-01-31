'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { fetchTheoryOfChange } from '@/components/logframe/server-actions';
import ImpactCard from '@/components/logframe/impact-card';
import OutcomeCard from '@/components/logframe/outcome-card';
import TheoryOfChangeSkeleton from '@/components/logframe/theory-of-change-skeleton';

export default function TheoryOfChangePage() {
  const { slug } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ['logframe', slug],
    queryFn: () => fetchTheoryOfChange(slug as string),
  });

  if (isLoading) {
    return <TheoryOfChangeSkeleton />;
  }

  if (error) {
    return <div>Error: {(error as Error).message}</div>;
  }

  const impact = data?.data?.impacts[0] || null;
  const outcomes = data?.data?.outcomes || [];
  const outputs = data?.data?.outputs || [];
  const projectId = data?.data?.id;

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-col gap-8 text-sm'>
        <ImpactCard impact={impact} projectId={projectId} />
        <div className='flex flex-col gap-4'>
          {outcomes.map((outcome) => (
            <OutcomeCard
              key={outcome.id}
              outcome={outcome}
              projectId={projectId}
              outputs={outputs}
            />
          ))}
          {outcomes.length === 0 && (
            <OutcomeCard
              outcome={null}
              projectId={projectId}
              outputs={outputs}
            />
          )}
        </div>
      </div>
    </div>
  );
}
