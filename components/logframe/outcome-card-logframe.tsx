'use client';

import { useState } from 'react';
import { Outcome } from '@/utils/types';
import OutcomeForm from './outcome-form';
import ActionButton from '@/components/ui/action-button';
import FeatureCardLogframe from './feature-card-logframe';

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
            <div className='flex grow items-center justify-between gap-4'>
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
