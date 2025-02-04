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

export default function LogframePage() {
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

  const sortedUnassignedOutputs = [
    ...(unassignedOutputs?.data?.outputs || []),
  ].sort((a, b) => {
    const aMatch = a.code?.match(/\.(\d+)$/);
    const bMatch = b.code?.match(/\.(\d+)$/);

    const aNum = aMatch ? parseInt(aMatch[1]) : 0;
    const bNum = bMatch ? parseInt(bMatch[1]) : 0;

    return isNaN(aNum) || isNaN(bNum) ? 0 : aNum - bNum;
  });

  const allOutputs = [...outputs, ...sortedUnassignedOutputs];

  const projectId = data?.data?.id;

  return (
    <div className='-mt-4 flex flex-col'>
      {(impact || outcomes.length > 0 || outputs.length > 0) && (
        <LogframeQuickNav outcomes={outcomes} outputs={allOutputs} />
      )}
      <div className='flex flex-col gap-8'>
        <div id='impact' className='mt-4 scroll-mt-20'>
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
            <OutcomeCardLogframe outcome={null} projectId={projectId} canEdit />
          )}
        </div>
        <div className='flex flex-col gap-4'>
          {allOutputs.map((output) => (
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
          <AddOutputButton projectId={projectId} output={null} />
        </div>
      </div>
    </div>
  );
}
