'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { fetchTheoryOfChange } from '@/components/logframe/server-actions';
import ImpactCard from '@/components/logframe/impact-card';
import OutcomeCard from '@/components/logframe/outcome-card';
import TheoryOfChangeSkeleton from '@/components/logframe/theory-of-change-skeleton';
import OutputsContainer from '@/components/logframe/outputs-container';
import LogframeQuickNav from '@/components/logframe/quick-nav';
import { extractOutputCodeNumber } from '@/components/logframe/extractOutputCodeNumber';

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

  const impact = data?.data?.impacts?.at(-1) || null;
  const outcomes = data?.data?.outcomes || [];
  const outputs = (data?.data?.outputs || [])
    .sort(
      (a, b) =>
        extractOutputCodeNumber(a.code) - extractOutputCodeNumber(b.code),
    )
    .filter((output) => !output.code.startsWith('U'));
  const projectId = data?.data?.id;

  return (
    <div className='-mt-4 flex w-full flex-col text-sm'>
      <LogframeQuickNav outcomes={outcomes} outputs={outputs} />
      <div className='flex flex-col gap-8'>
        <div className='mt-4 scroll-mt-20' id='impact'>
          <ImpactCard impact={impact} projectId={projectId} />
        </div>
        <div className='flex flex-col gap-8'>
          {outcomes.map((outcome) => (
            <div
              key={outcome.id}
              id={`outcome-${outcome.id}`}
              className='scroll-mt-20'
            >
              <OutcomeCard
                key={outcome.id}
                outcome={outcome}
                projectId={projectId}
              />
            </div>
          ))}
          {outcomes.length === 0 && (
            <OutcomeCard outcome={null} projectId={projectId} />
          )}
        </div>
        <div>
          {outputs.length > 0 && (
            <div className='flex flex-col gap-8'>
              <OutputsContainer outputs={outputs} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
