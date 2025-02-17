'use client';

import { useState } from 'react';
import { Outcome } from '@/utils/types';

import OutcomeForm from './outcome-form';
import ActionButton from '@/components/ui/action-button';
import FeatureCardTheoryOfChange from './feature-card-theory-of-change';
import { extractOutputCodeNumber } from './extractOutputCodeNumber';

export default function OutcomeCard({
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
  return (
    <div className='relative flex flex-col gap-8'>
      {!outcome && canEdit && (
        <FeatureCardTheoryOfChange
          title='Outcome'
          minHeight='100%'
          variant='outcome'
        >
          <div className='flex items-center justify-center rounded-md border border-dashed p-12'>
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
        </FeatureCardTheoryOfChange>
      )}

      {outcomes && outcome && (
        <>
          <FeatureCardTheoryOfChange
            title={
              outcomes.length > 1
                ? `Outcome ${extractOutputCodeNumber(outcome.code)}`
                : 'Outcome'
            }
            variant='outcome'
            minHeight='100%'
          >
            <div className='flex grow flex-col items-start justify-between gap-4'>
              <div>
                <p className='max-w-prose text-sm'>{outcome.description}</p>
              </div>
              {canEdit && (
                <div className='flex-shrink-0 text-sm'>
                  <ActionButton
                    action='edit'
                    onClick={() => setIsOutcomeDialogOpen(true)}
                  />
                </div>
              )}
            </div>

            <OutcomeForm
              isOpen={isOutcomeDialogOpen}
              onClose={() => setIsOutcomeDialogOpen(false)}
              outcome={outcome}
              projectId={projectId}
            />
          </FeatureCardTheoryOfChange>
        </>
      )}
    </div>
  );
}
