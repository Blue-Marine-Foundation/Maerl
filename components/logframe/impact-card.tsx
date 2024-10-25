'use client';

import { Impact } from '@/utils/types';
import FeatureCard from '../ui/feature-card';
import { Pencil, PlusCircle } from 'lucide-react';
import { useState } from 'react';
import ImpactForm from './impact-form';

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
          <button
            onClick={() => setIsDialogOpen(true)}
            className='flex items-center gap-2 rounded-md border px-4 py-2 text-sm'
          >
            <PlusCircle className='h-4 w-4' /> Add impact
          </button>
        </div>
      ) : (
        <div className='flex grow flex-col items-start justify-between gap-4'>
          <p className='text-base'>{impact.title}</p>
          <div className='flex w-full justify-end text-sm'>
            <button
              onClick={() => setIsDialogOpen(true)}
              className='flex items-center gap-3 rounded-md border px-4 py-2 text-sm'
            >
              <Pencil className='h-3 w-3' /> Edit
            </button>
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
