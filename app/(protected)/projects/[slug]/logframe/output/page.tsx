'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useSearchParams } from 'next/navigation';
import { fetchOutputById } from '@/components/logframe/server-actions';
import OutputCard from '@/components/logframe/output-card';
import FeatureCard from '@/components/ui/feature-card';
import Link from 'next/link';

function OutputContent() {
  const { slug } = useParams();
  const searchParams = useSearchParams();
  const outputId = searchParams.get('id');

  if (!outputId) {
    return (
      <FeatureCard title='No output ID'>
        <div className='flex grow flex-col gap-6'>
          <p>
            Apologies, we couldn't find the output you were looking for because
            there is no ID in the URL.
          </p>
          <p>
            {' '}
            You can click through to an output from the{' '}
            <Link className='underline' href={`/projects/${slug}/logframe`}>
              project logframe
            </Link>
            .
          </p>
        </div>
      </FeatureCard>
    );
  }

  const { data: outputData, isLoading } = useQuery({
    queryKey: ['output', outputId],
    queryFn: () => fetchOutputById(outputId as string),
  });

  if (isLoading) {
    return <div>Loading output with database id: {outputId}</div>;
  }

  if (!outputData) {
    return (
      <div>
        Apologies, output with database id: {outputId} was not found, please
        notify the SII team.
      </div>
    );
  }

  return <OutputCard output={outputData} />;
}

export default function LogframeOutputPage() {
  return <OutputContent />;
}
