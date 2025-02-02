'use client';

import { useState } from 'react';
import { Outcome } from '@/utils/types';
import OutcomeForm from './outcome-form';
import ActionButton from '@/components/ui/action-button';
import FeatureCardLogframe from './feature-card-logframe';
import OutcomeIndicatorsTable from './outcome-indicators-table';
import { extractOutputCodeNumber } from './extractOutputCodeNumber';

export default function OutcomeCardLogframe({
  canEdit = false,
  outcome,
  projectId,
}: {
  /** Enables the Add Impact and Edit Impact buttons*/
  canEdit?: boolean;
  outcome: Outcome | null;
  projectId: number;
}) {
  const [isOutcomeDialogOpen, setIsOutcomeDialogOpen] = useState(false);

  const outcomeMeasurables =
    outcome?.outcome_measurables?.sort(
      (a, b) =>
        extractOutputCodeNumber(a.code) - extractOutputCodeNumber(b.code),
    ) || [];

  return (
    <div className='relative flex flex-col gap-8'>
      {!outcome && canEdit && (
        <FeatureCardLogframe title='Outcome' minHeight='100%' variant='green'>
          <div className='flex grow flex-col items-center justify-center gap-4'>
            <ActionButton
              action='add'
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
        </FeatureCardLogframe>
      )}

      {outcome && (
        <>
          <FeatureCardLogframe title='Outcome' variant='green' minHeight='100%'>
            <div className='flex w-full grow flex-col items-start justify-between gap-4'>
              <div className='flex w-full flex-row justify-between gap-8 rounded-md bg-card pb-6'>
                <p className='max-w-prose text-sm'>{outcome.description}</p>
                {canEdit && (
                  <div className='flex-shrink-0 text-sm'>
                    <ActionButton
                      action='edit'
                      onClick={() => setIsOutcomeDialogOpen(true)}
                    />
                  </div>
                )}
              </div>
              <OutcomeIndicatorsTable
                measurables={outcomeMeasurables}
                outcomeId={outcome.id}
                projectId={projectId}
              />
            </div>

            <OutcomeForm
              isOpen={isOutcomeDialogOpen}
              onClose={() => setIsOutcomeDialogOpen(false)}
              outcome={outcome}
              projectId={projectId}
            />
          </FeatureCardLogframe>
        </>
      )}
    </div>
  );
}
