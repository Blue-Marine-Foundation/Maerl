'use client';

import { Impact } from '@/utils/types';
import FeatureCard from '../ui/feature-card';
import { useState } from 'react';
import ImpactForm from './impact-form';
import ActionButton from '../ui/action-button';

export default function ImpactCard({
  impact,
  projectId,
}: {
  impact: Impact | null;
  projectId: number;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <FeatureCard title='Impact'>
      {!impact ? (
        <div className='flex grow flex-col items-center justify-center gap-4'>
          <ActionButton
            action='add'
            label='Add impact'
            onClick={() => setIsDialogOpen(true)}
          />
        </div>
      ) : (
        <div className='flex grow flex-col items-start justify-between gap-4'>
          <p className='text-base'>{impact.title}</p>
          <div className='flex w-full justify-end text-sm'>
            <ActionButton action='edit' onClick={() => setIsDialogOpen(true)} />
          </div>
        </div>
      )}
      <ImpactForm
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        impact={impact}
        projectId={projectId}
      />
    </FeatureCard>
  );
}
