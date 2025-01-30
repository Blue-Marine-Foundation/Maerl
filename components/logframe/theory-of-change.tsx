'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchLogframe } from '@/components/logframe/server-actions';
import ImpactCard from '@/components/logframe/impact-card';
import OutcomeCard from '@/components/logframe/outcome-card';
import TheoryOfChangeSkeleton from '@/components/logframe/theory-of-change-skeleton';

export default function TheoryOfChange({ slug }: { slug: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['logframe', slug],
    queryFn: () => fetchLogframe(slug),
  });

  if (isLoading) {
    return <TheoryOfChangeSkeleton />;
  }

  if (error) {
    return <div>Error: {(error as Error).message}</div>;
  }

  const impact = data?.data?.impacts[0] || null;
  const outcomes = data?.data?.outcomes || [];
  const projectId = data?.data?.id;

  return (
    <div className='flex flex-col gap-8 text-sm'>
      <ImpactCard impact={impact} projectId={projectId} />
      <div className='flex flex-col gap-4'>
        {outcomes.map((outcome) => (
          <OutcomeCard
            key={outcome.id}
            outcome={outcome}
            projectId={projectId}
          />
        ))}
        {outcomes.length === 0 && (
          <OutcomeCard outcome={null} projectId={projectId} />
        )}
      </div>
    </div>
  );
}
