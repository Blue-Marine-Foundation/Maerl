'use client';

import { Outcome } from '@/utils/types';
import FeatureCard from '@/components/ui/feature-card';
import { useState } from 'react';
import OutcomeForm from '@/components/logframe/outcome-form';
import EditButton from '@/components/ui/edit-button';
import { Badge } from '@/components/ui/badge';

export default function OutcomeCard({
  outcome,
  projectId,
}: {
  outcome: Outcome | null;
  projectId: number;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className='grid grid-cols-[1fr_2fr] items-start justify-between gap-8'>
      {!outcome && (
        <FeatureCard title='Outcome'>
          <div className='flex grow flex-col items-center justify-center gap-4'>
            <EditButton
              variant='add'
              label='Add outcome'
              onClick={() => setIsDialogOpen(true)}
            />
          </div>
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
                <EditButton onClick={() => setIsDialogOpen(true)} />
              </div>
            </div>

            <OutcomeForm
              isOpen={isDialogOpen}
              onClose={() => setIsDialogOpen(false)}
              outcome={outcome}
              projectId={projectId}
            />
          </FeatureCard>
          <FeatureCard title='Outcome Indicators'>
            <div className='flex w-full grow flex-col gap-2'>
              {outcome.outcome_measurables.map((measurable) => (
                <div key={measurable.id} className='mb-2 text-sm'>
                  <p>
                    <Badge className='mr-2'>{measurable.code}</Badge>
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
          </FeatureCard>
        </>
      )}
    </div>
  );
}
