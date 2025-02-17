'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Outcome } from '@/utils/types';
import OutcomeForm from './outcome-form';
import ActionButton from '@/components/ui/action-button';
import FeatureCardLogframe from './feature-card-logframe';
import OutcomeIndicatorsTable from './outcome-indicators-table';
import { extractOutputCodeNumber } from './extractOutputCodeNumber';

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
  const [isTableExpanded, setIsTableExpanded] = useState(true);

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

      {outcomes && outcome && (
        <>
          <FeatureCardLogframe
            title={
              outcomes.length > 1
                ? `Outcome ${extractOutputCodeNumber(outcome.code)}`
                : 'Outcome'
            }
            variant='green'
            minHeight='100%'
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
              <div className='w-full'>
                <button
                  onClick={() => setIsTableExpanded(!isTableExpanded)}
                  className='mb-2 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground'
                >
                  {isTableExpanded ? (
                    <>
                      <ChevronDown className='h-4 w-4 transition-transform duration-200' />{' '}
                      Hide indicators
                    </>
                  ) : (
                    <>
                      <ChevronRight className='h-4 w-4 transition-transform duration-200' />{' '}
                      Show indicators
                    </>
                  )}
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${isTableExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <OutcomeIndicatorsTable
                    measurables={outcomeMeasurables}
                    outcomeId={outcome.id}
                    projectId={projectId}
                  />
                </div>
              </div>
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
