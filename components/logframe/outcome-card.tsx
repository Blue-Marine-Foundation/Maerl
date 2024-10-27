'use client';

import { useState } from 'react';
import { Outcome } from '@/utils/types';
import FeatureCard from '@/components/ui/feature-card';
import OutcomeForm from './outcome-form';
import EditButton from '@/components/ui/edit-button';
import { Badge } from '@/components/ui/badge';
import OutcomeMeasurableCard from './outcome-measurable-card';

export default function OutcomeCard({
  outcome,
  projectId,
}: {
  outcome: Outcome | null;
  projectId: number;
}) {
  const [isOutcomeDialogOpen, setIsOutcomeDialogOpen] = useState(false);

  return (
    <div className='grid grid-cols-[1fr_2fr] items-start justify-between gap-8'>
      {!outcome && (
        <FeatureCard title='Outcome'>
          <div className='flex grow flex-col items-center justify-center gap-4'>
            <EditButton
              variant='add'
              label='Add outcome'
              onClick={() => setIsOutcomeDialogOpen(true)}
            />
          </div>
          <OutcomeForm
            isOpen={isOutcomeDialogOpen}
            onClose={() => setIsOutcomeDialogOpen(false)}
            outcome={outcome}
            projectId={projectId}
          />
        </FeatureCard>
      )}

      {outcome && (
        <>
          <FeatureCard title='Outcome'>
            <div className='flex grow flex-col items-start justify-between gap-4'>
              <div>
                <p className='text-sm'>
                  <Badge className='mr-2'>{outcome.code}</Badge>
                  {outcome.description}
                </p>
              </div>
              <div className='flex w-full justify-end text-sm'>
                <EditButton onClick={() => setIsOutcomeDialogOpen(true)} />
              </div>
            </div>

            <OutcomeForm
              isOpen={isOutcomeDialogOpen}
              onClose={() => setIsOutcomeDialogOpen(false)}
              outcome={outcome}
              projectId={projectId}
            />
          </FeatureCard>
          <OutcomeMeasurableCard
            measurables={outcome.outcome_measurables}
            outcomeId={outcome.id}
            projectId={projectId}
          />
        </>
      )}
    </div>
  );
}
