'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  fetchLogframe,
  fetchUnassignedOutputs,
} from '@/components/logframe/server-actions';
import AddOutputButton from '@/components/logframe/add-output-button';
import OutputCardLogframe from '@/components/logframe/output-card-logframe';
import OutcomeCardLogframe from '@/components/logframe/outcome-card-logframe';
import ImpactCardLogframe from '@/components/logframe/impact-card-logframe';
import LogframeQuickNav from '@/components/logframe/quick-nav';
import FeatureCardLogframe from '@/components/logframe/feature-card-logframe';
import { useLogframeDeeplinking } from './useLogframeDeeplinking';
import { useUser } from '@/components/user/user-provider';

export default function LogframePage() {
  const { slug } = useParams();
  const { canEditLogframe } = useUser();

  const logframeQuery = useQuery({
    queryKey: ['logframe', slug],
    queryFn: () => fetchLogframe(slug as string),
  });

  const unassignedQuery = useQuery({
    queryKey: ['unassigned-outputs', slug],
    queryFn: () => fetchUnassignedOutputs(slug as string),
  });

  useLogframeDeeplinking();

  const { data } = logframeQuery;
  const { data: unassignedOutputs } = unassignedQuery;
  const failed =
    logframeQuery.error ||
    data?.error ||
    unassignedQuery.error ||
    unassignedOutputs?.error;

  if (failed || (logframeQuery.isSuccess && !data?.data)) {
    return (
      <div
        role='alert'
        className='rounded-md border border-destructive/30 bg-destructive/10 p-4'
      >
        <p className='font-medium'>Unable to load the logframe</p>
        <p className='mt-1 text-sm text-muted-foreground'>
          We couldn't load this project's data. Try again, or contact an
          administrator if the problem continues.
        </p>
        <button
          type='button'
          className='mt-3 rounded-md bg-primary px-3 py-1 text-sm text-primary-foreground disabled:opacity-50'
          disabled={logframeQuery.isFetching || unassignedQuery.isFetching}
          onClick={() => {
            void logframeQuery.refetch();
            void unassignedQuery.refetch();
          }}
        >
          Try again
        </button>
      </div>
    );
  }

  if (logframeQuery.isLoading || unassignedQuery.isLoading) {
    return <div>Loading...</div>;
  }

  const impact = data?.data?.impacts?.at(-1) || null;
  const outcomes = data?.data?.outcomes || [];
  const mergedOutputs = [
    ...(data?.data?.outputs || []),
    ...(unassignedOutputs?.data?.outputs || []),
  ];
  const uniqueOutputs = Array.from(
    new Map(mergedOutputs.map((output) => [output.id, output])).values(),
  );
  const allOutputs = uniqueOutputs
    .sort((a, b) => {
      const getPrefix = (code: string) => code?.split('.')[0] || '';
      const getNum = (code: string) => {
        const match = code?.match(/\.(\d+)$/);
        return match ? Number.parseInt(match[1], 10) : Number.POSITIVE_INFINITY;
      };
      const prefixA = getPrefix(a.code);
      const prefixB = getPrefix(b.code);
      if (prefixA !== prefixB) {
        return prefixA.localeCompare(prefixB);
      }
      return getNum(a.code) - getNum(b.code);
    })
    .filter((output) => !output.archived);
  const projectId = data?.data?.id;

  return (
    <div className='-mt-4 flex flex-col'>
      {(impact || outcomes.length > 0 || allOutputs.length > 0) && (
        <LogframeQuickNav outcomes={outcomes} outputs={allOutputs} />
      )}
      <div className='flex flex-col gap-8'>
        <div id='impact' className='mt-4'>
          <ImpactCardLogframe
            impact={impact}
            projectId={projectId}
            canEdit={canEditLogframe}
          />
        </div>
        <div className='flex flex-col gap-8'>
          {outcomes.map((outcome) => (
            <div key={outcome.id} id={`outcome-${outcome.id}`}>
              <OutcomeCardLogframe
                outcome={outcome}
                outcomes={outcomes}
                projectId={projectId}
                canEdit={canEditLogframe}
              />
            </div>
          ))}
          {outcomes.length === 0 && (
            <OutcomeCardLogframe
              outcome={null}
              projectId={projectId}
              canEdit={canEditLogframe}
            />
          )}
        </div>
        <div className='flex flex-col gap-8'>
          {allOutputs.map((output) => (
            <div key={output.id} id={`output-${output.id}`}>
              <OutputCardLogframe
                output={output}
                projectId={projectId}
                projectSlug={slug as string}
                canEdit={canEditLogframe}
              />
            </div>
          ))}
          {canEditLogframe && allOutputs.length > 0 && (
            <div className='mt-4'>
              <AddOutputButton
                projectId={projectId}
                output={null}
                existingCodes={allOutputs.map((o) => o.code)}
              />
            </div>
          )}
          {allOutputs.length === 0 && (
            <FeatureCardLogframe title='Outputs' variant='output'>
              <div className='mt-4'>
                {canEditLogframe ? (
                  <AddOutputButton
                    projectId={projectId}
                    output={null}
                    existingCodes={allOutputs.map((o) => o.code)}
                  />
                ) : (
                  <p className='text-sm text-muted-foreground'>
                    No outputs yet.
                  </p>
                )}
              </div>
            </FeatureCardLogframe>
          )}
        </div>
      </div>
    </div>
  );
}
