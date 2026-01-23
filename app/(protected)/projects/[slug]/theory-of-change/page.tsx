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
import { useUser } from '@/components/user/user-provider';

export default function TheoryOfChangePage() {
  const { slug } = useParams();
  const { canEditLogframe } = useUser();

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

  if (!isLoading && !error && data && data.data === null) {
    return <p>Error: Theory of change incorrectly fetched from database</p>
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
        <div className='mt-4' id='impact'>
          <ImpactCard
            impact={impact}
            projectId={projectId}
            canEdit={canEditLogframe && !impact}
          />
        </div>
        <div className='mx-16 flex flex-col gap-8'>
          {outcomes.map((outcome) => (
            <div key={outcome.id} id={`outcome-${outcome.id}`}>
              <OutcomeCard
                key={outcome.id}
                outcome={outcome}
                outcomes={outcomes}
                projectId={projectId}
                canEdit={canEditLogframe}
              />
            </div>
          ))}
          {outcomes.length === 0 && (
            <OutcomeCard
              outcome={null}
              projectId={projectId}
              canEdit={canEditLogframe}
            />
          )}
        </div>
        <div>
          {
            <div className='mx-32 flex flex-col gap-8'>
              <OutputsContainer
                outputs={outputs}
                projectId={projectId}
                canEdit={canEditLogframe}
              />
            </div>
          }
        </div>
      </div>
    </div>
  );
}
