'use client';

import { useState } from 'react';
import { Outcome, OutcomeMeasurable } from '@/utils/types';
import FeatureCard from '@/components/ui/feature-card';
import OutcomeForm from './outcome-form';
import OutcomeMeasurableForm from './outcome-measurable-form';
import EditButton from '@/components/ui/edit-button';
import { Badge } from '@/components/ui/badge';

export default function OutcomeCard({
  outcome,
  projectId,
}: {
  outcome: Outcome | null;
  projectId: number;
}) {
  const [isOutcomeDialogOpen, setIsOutcomeDialogOpen] = useState(false);
  const [isMeasurableDialogOpen, setIsMeasurableDialogOpen] = useState(false);
  const [selectedMeasurable, setSelectedMeasurable] =
    useState<OutcomeMeasurable | null>(null);

  const handleEditMeasurable = (measurable: OutcomeMeasurable) => {
    setSelectedMeasurable(measurable);
    setIsMeasurableDialogOpen(true);
  };

  const handleCloseMeasurableDialog = () => {
    setIsMeasurableDialogOpen(false);
    setSelectedMeasurable(null);
  };

  const handleAddMeasurable = () => {
    if (outcome) {
      const nextIndex = (outcome.outcome_measurables.length || 0) + 1;
      const nextCode = `OC0.${nextIndex}`;
      setSelectedMeasurable({ code: nextCode } as OutcomeMeasurable);
      setIsMeasurableDialogOpen(true);
    }
  };

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
          <FeatureCard title='Outcome Indicators'>
            <div className='flex w-full grow flex-col gap-2'>
              {outcome.outcome_measurables.map((measurable) => (
                <div key={measurable.id} className='mb-2 text-sm'>
                  <div className='flex items-start justify-between'>
                    <div>
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
                    <EditButton
                      onClick={() => handleEditMeasurable(measurable)}
                    />
                  </div>
                </div>
              ))}
              <div className='mt-4 flex justify-end'>
                <EditButton
                  variant='add'
                  label='Add indicator'
                  onClick={handleAddMeasurable}
                />
              </div>
            </div>

            <OutcomeMeasurableForm
              isOpen={isMeasurableDialogOpen}
              onClose={handleCloseMeasurableDialog}
              measurable={selectedMeasurable}
              outcomeId={outcome.id}
            />
          </FeatureCard>
        </>
      )}
    </div>
  );
}
