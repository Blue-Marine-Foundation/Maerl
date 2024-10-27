'use client';

import { Outcome } from '@/utils/types';
import FeatureCard from '../ui/feature-card';
import { Pencil, PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import OutcomesForm from './outcomes-form';

export default function OutcomesCard({
  outcome,
  projectId,
}: {
  outcome: Outcome | null;
  projectId: number;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <FeatureCard title='Outcome'>
      {!outcome ? (
        <div className='flex grow flex-col items-center justify-center gap-4'>
          <button
            onClick={() => setIsDialogOpen(true)}
            className='flex items-center gap-2 rounded-md border px-4 py-2 text-sm'
          >
            <PlusCircle className='h-4 w-4' /> Add outcome
          </button>
        </div>
      ) : (
        <div className='flex grow flex-col items-start justify-between gap-4'>
          <div>
            <p className='text-sm'>{outcome.description}</p>
          </div>
          <div className='w-full'>
            <h4 className='mb-2 text-sm font-medium text-muted-foreground'>
              Outcome Indicators:
            </h4>
            {outcome.outcome_measurables.map((measurable) => (
              <div
                key={measurable.id}
                className='mb-2 flex flex-col gap-1 text-sm'
              >
                <p>
                  <Badge className='mr-2'>{measurable.code}</Badge>{' '}
                  {measurable.description}
                </p>
                <p className='text-xs text-muted-foreground'>
                  Verification: {measurable.verification}
                </p>
                <p className='text-xs text-muted-foreground'>
                  Assumptions: {measurable.assumptions}
                </p>
              </div>
            ))}
          </div>
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
      <OutcomesForm
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        outcome={outcome}
        projectId={projectId}
      />
    </FeatureCard>
  );
}
