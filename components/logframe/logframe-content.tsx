'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchLogframe } from '@/components/logframe/server-actions';
import OutputsTable from '@/components/logframe/outputs-table';

export default function LogframeContent() {
  const { slug } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ['logframe', slug],
    queryFn: () => fetchLogframe(slug as string),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const outputs =
    data?.data?.outcomes
      .flatMap((outcome) => outcome.outcome_measurables)
      .flatMap((measurable) => measurable.outputs)
      .sort((a, b) => {
        const aNum = parseInt(a.code.split('.')[1]);
        const bNum = parseInt(b.code.split('.')[1]);
        return aNum - bNum;
      }) || [];
  const projectId = data?.data?.id;

  return (
    <div className='flex flex-col gap-4'>
      <h4 className='text-lg font-semibold'>Logframe</h4>
      <OutputsTable outputs={outputs} projectId={projectId} />
    </div>
  );
}
