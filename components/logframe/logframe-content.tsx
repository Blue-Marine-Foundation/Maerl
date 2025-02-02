'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  fetchLogframe,
  fetchUnassignedOutputs,
} from '@/components/logframe/server-actions';
import ImpactCardLogframe from './impact-card-logframe';
import OutcomeCardLogframe from './outcome-card-logframe';
import OutputCardLogframe from './output-card-logframe';
import { extractOutputCodeNumber } from './extractOutputCodeNumber';

export default function LogframeContent() {
  const { slug } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ['logframe', slug],
    queryFn: () => fetchLogframe(slug as string),
  });

  const { data: unassignedOutputs } = useQuery({
    queryKey: ['unassigned-outputs', slug],
    queryFn: () => fetchUnassignedOutputs(slug as string),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const impact = data?.data?.impacts?.at(-1) || null;
  const outcomes = data?.data?.outcomes || [];
  const outputs = [...(data?.data?.outcomes || [])]
    .flatMap((outcome) => outcome?.outcome_measurables || [])
    .flatMap((measurable) => measurable?.outputs || [])
    .filter((output): output is NonNullable<typeof output> => !!output)
    .sort((a, b) => {
      const aMatch = a.code?.match(/\.(\d+)$/);
      const bMatch = b.code?.match(/\.(\d+)$/);

      const aNum = aMatch ? parseInt(aMatch[1]) : 0;
      const bNum = bMatch ? parseInt(bMatch[1]) : 0;

      return isNaN(aNum) || isNaN(bNum) ? 0 : aNum - bNum;
    });
  console.log(outputs);

  const sortedUnassignedOutputs = [
    ...(unassignedOutputs?.data?.outputs || []),
  ].sort((a, b) => {
    const aMatch = a.code?.match(/\.(\d+)$/);
    const bMatch = b.code?.match(/\.(\d+)$/);

    const aNum = aMatch ? parseInt(aMatch[1]) : 0;
    const bNum = bMatch ? parseInt(bMatch[1]) : 0;

    return isNaN(aNum) || isNaN(bNum) ? 0 : aNum - bNum;
  });

  const projectId = data?.data?.id;

  return (
    <>
      {(impact || outcomes.length > 0 || outputs.length > 0) && (
        <nav className='sticky top-4 z-10 rounded-lg bg-background/95 px-4 py-4 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60'>
          <div className='flex flex-row items-center gap-2'>
            <p className='text-sm text-muted-foreground'>
              View {data?.data?.name && `${data.data.name}`}:
            </p>
            <div className='flex flex-wrap gap-2'>
              {impact && (
                <a
                  href='#impact'
                  className='rounded border bg-card px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-gray-100'
                >
                  Impact
                </a>
              )}
              {outcomes.map((outcome, index) => (
                <a
                  key={outcome.id}
                  href={`#outcome-${outcome.id}`}
                  className='rounded border bg-card px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-gray-100'
                >
                  {`Outcome ${index + 1}`}
                </a>
              ))}
              {outputs.map((output) => (
                <a
                  key={output.id}
                  href={`#output-${output.id}`}
                  className='rounded border bg-card px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-gray-100'
                >
                  {`Output ${extractOutputCodeNumber(output.code)}`}
                </a>
              ))}
            </div>
          </div>
        </nav>
      )}
      <div className='flex flex-col'>
        <div className='flex flex-col gap-8'>
          <div id='impact' className='scroll-mt-20'>
            <ImpactCardLogframe impact={impact} projectId={projectId} canEdit />
          </div>
          <div className='flex flex-col gap-4'>
            {outcomes.map((outcome) => (
              <div
                key={outcome.id}
                id={`outcome-${outcome.id}`}
                className='scroll-mt-20'
              >
                <OutcomeCardLogframe
                  outcome={outcome}
                  projectId={projectId}
                  canEdit
                />
              </div>
            ))}
            {outcomes.length === 0 && (
              <OutcomeCardLogframe
                outcome={null}
                projectId={projectId}
                canEdit
              />
            )}
          </div>
          <div className='flex flex-col gap-4'>
            {outputs.map((output) => (
              <div
                key={output.id}
                id={`output-${output.id}`}
                className='scroll-mt-20'
              >
                <OutputCardLogframe
                  output={output}
                  projectId={projectId}
                  canEdit
                />
              </div>
            ))}
            {outputs.length === 0 && (
              <OutputCardLogframe output={null} projectId={projectId} canEdit />
            )}
          </div>
        </div>

        {/* TODO: Handle unplanned or unassigned outputs */}
        {/* {sortedUnassignedOutputs && sortedUnassignedOutputs.length > 0 && (
        <div className='flex flex-col gap-4'>
          <h4 className='text-lg font-semibold'>
            Unplanned or unassigned outputs
          </h4>

          <OutputsTable
            outputs={sortedUnassignedOutputs}
            projectId={projectId}
          />
        </div>
      )} */}
      </div>
    </>
  );
}
