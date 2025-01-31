'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  fetchLogframe,
  fetchUnassignedOutputs,
} from '@/components/logframe/server-actions';
import OutputsTable from '@/components/logframe/outputs-table';
import ImpactCard from './impact-card';
import OutcomeCard from './outcome-card';

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
    <div className='flex flex-col gap-8'>
      <div className='flex flex-col gap-4'>
        <h4 className='text-lg font-semibold'>Logframe</h4>
        <ImpactCard impact={impact} projectId={projectId} canEdit />
        <div className='flex flex-col gap-4'>
          {outcomes.map((outcome) => (
            <OutcomeCard
              key={outcome.id}
              outcome={outcome}
              projectId={projectId}
              canEdit
            />
          ))}
          {outcomes.length === 0 && (
            <OutcomeCard outcome={null} projectId={projectId} canEdit />
          )}
        </div>
        <OutputsTable outputs={outputs} projectId={projectId} />
      </div>

      {sortedUnassignedOutputs && sortedUnassignedOutputs.length > 0 && (
        <div className='flex flex-col gap-4'>
          <h4 className='text-lg font-semibold'>
            Unplanned or unassigned outputs
          </h4>

          <OutputsTable
            outputs={sortedUnassignedOutputs}
            projectId={projectId}
          />
        </div>
      )}
    </div>
  );
}
