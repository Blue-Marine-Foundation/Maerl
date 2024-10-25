'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchLogframe } from '@/components/logframe/server-action';
import ImpactCard from '@/components/logframe/impact-card';
import OutcomesForm from '@/components/logframe/outcomes-form';

export default function TheoryOfChange({ slug }: { slug: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['logframe', slug],
    queryFn: () => fetchLogframe(slug),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {(error as Error).message}</div>;
  }

  const impact = data?.data?.impacts[0] || null;
  const outcomes = data?.data?.outcomes || null;
  const projectId = data?.data?.id;

  return (
    <div className='grid grid-cols-[30%_1fr] items-start gap-8 text-sm'>
      <ImpactCard impact={impact} projectId={projectId} />
      {/* <div className='flex flex-col gap-4'>
          {outcomes.map((outcome, index) => (
            <OutcomesForm key={outcome.id} outcome={outcome} />
          ))}
        </div> */}
    </div>
  );
}
