'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchLogframe } from '@/components/logframe/server-action';
import ImpactCard from '@/components/logframe/impact-card';
import OutcomesCard from '@/components/logframe/outcomes-card';
import TheoryOfChangeSkeleton from './theory-of-change-skeleton';

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
    <div className='relative grid grid-cols-[30%_1fr] items-start gap-8 text-sm'>
      <div className='sticky top-4'>
        <ImpactCard impact={impact} projectId={projectId} />
      </div>
      <div className='flex flex-col gap-4'>
        {outcomes.map((outcome) => (
          <OutcomesCard
            key={outcome.id}
            outcome={outcome}
            projectId={projectId}
          />
        ))}
        {outcomes.length === 0 && (
          <OutcomesCard outcome={null} projectId={projectId} />
        )}
      </div>
    </div>
  );
}
