'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchLogframe } from '@/components/logframe/server-actions';
import OutputsTable from '@/components/logframe/outputs-table';
import FeatureCard from '../ui/feature-card';

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
    data?.data?.outputs.sort((a, b) => a.code.localeCompare(b.code)) || [];
  const projectId = data?.data?.id;

  return (
    <div className='flex flex-col gap-4'>
      <FeatureCard title='Logframe'>
        <OutputsTable outputs={outputs} projectId={projectId} />
      </FeatureCard>
    </div>
  );
}
