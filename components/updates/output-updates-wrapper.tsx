'use client';

import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import UpdatesListLarge from './updates-list-large';
import FeatureCard from '../ui/feature-card';
import { fetchOutputUpdates } from './server-actions';

export default function OutputUpdatesWrapper() {
  const searchParams = useSearchParams();
  const outputId = searchParams.get('id');

  const {
    data: updates,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['output-updates', outputId],
    queryFn: () => fetchOutputUpdates(outputId as string),
    enabled: !!outputId,
  });

  if (!outputId) {
    return (
      <FeatureCard title='Updates'>
        <p className='text-sm text-muted-foreground'>No output ID provided</p>
      </FeatureCard>
    );
  }

  if (isLoading) {
    return (
      <FeatureCard title='Updates'>
        <p className='text-sm text-muted-foreground'>Loading updates...</p>
      </FeatureCard>
    );
  }

  if (error) {
    return (
      <FeatureCard title='Updates'>
        <p className='text-sm text-muted-foreground'>
          Error loading updates: {(error as Error).message}
        </p>
      </FeatureCard>
    );
  }

  return (
    <FeatureCard title='Updates'>
      <UpdatesListLarge updates={updates || []} />
    </FeatureCard>
  );
}
