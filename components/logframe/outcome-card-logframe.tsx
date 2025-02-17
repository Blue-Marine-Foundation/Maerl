'use client';

import { useState } from 'react';
import { Outcome } from '@/utils/types';
import OutcomeForm from './outcome-form';
import ActionButton from '@/components/ui/action-button';
import FeatureCardLogframe from './feature-card-logframe';
import OutcomeIndicatorsTable from './outcome-indicators-table';
import { extractOutputCodeNumber } from './extractOutputCodeNumber';
import { logframeText } from './logframe-text';

export default function OutcomeCardLogframe({
  canEdit = false,
  outcome,
  outcomes,
  projectId,
}: {
  /** Enables the Add Impact and Edit Impact buttons*/
  canEdit?: boolean;
  outcome: Outcome | null;
  outcomes?: Outcome[];
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
        <FeatureCardLogframe
          title='Outcome'
          minHeight='100%'
          variant='outcome'
          tooltipText={logframeText.outcome.description}
        >
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

      {outcomes && outcome && (
        <>
          <FeatureCardLogframe
            title={
              outcomes.length > 1
                ? `Outcome ${extractOutputCodeNumber(outcome.code)}`
                : 'Outcome'
            }
            variant='outcome'
            minHeight='100%'
            tooltipText={logframeText.outcome.description}
          >
            <div className='flex w-full grow flex-col items-start justify-between gap-6'>
              <div className='flex w-full flex-row items-center justify-between'>
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
