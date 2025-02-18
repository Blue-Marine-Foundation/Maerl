'use client';

import { useState } from 'react';
import { Output } from '@/utils/types';
import ActionButton from '@/components/ui/action-button';
import FeatureCardLogframe from './feature-card-logframe';
import OutputForm from './output-form';
import { extractOutputCodeNumber } from './extractOutputCodeNumber';
import AddOutputButton from './add-output-button';
import OutputIndicatorsDetailsTable from './output-indicators-details-table';
import { ChevronDown, ChevronRight } from 'lucide-react';

export default function OutputCardLogframe({
  canEdit = false,
  output,
  projectId,
}: {
  /** Enables the Add Output and Edit Output buttons*/
  canEdit?: boolean;
  output: Output | null;
  projectId: number;
}) {
  const [isOutputDialogOpen, setIsOutputDialogOpen] = useState(false);
  const [isTableExpanded, setIsTableExpanded] = useState(true);

  return (
    <div className='relative flex flex-col gap-8'>
      {!output && canEdit && (
        <FeatureCardLogframe title='Output' minHeight='100%' variant='slate'>
          <div className='flex grow flex-col items-center justify-center gap-4'>
            <AddOutputButton projectId={projectId} output={output} />
          </div>
        </FeatureCardLogframe>
      )}

      {output && (
        <FeatureCardLogframe
          title={
            output.code?.startsWith('U')
              ? `Unassigned Output  ${extractOutputCodeNumber(output.code)}`
              : `Output ${extractOutputCodeNumber(output.code)}`
          }
          variant='slate'
          minHeight='100%'
        >
          <div className='flex w-full grow flex-col items-start justify-between gap-6'>
            <div className='flex w-full flex-row justify-between gap-8 rounded-md bg-card'>
              <p className='max-w-prose text-sm'>{output.description}</p>
              {canEdit && (
                <div className='flex-shrink-0 space-x-2 text-sm'>
                  <ActionButton
                    action='edit'
                    onClick={() => setIsOutputDialogOpen(true)}
                  />
                </div>
              )}
            </div>
            <div className='w-full'>
              <button
                onClick={() => setIsTableExpanded(!isTableExpanded)}
                className='mb-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground'
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
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isTableExpanded
                    ? 'max-h-[1000px] opacity-100'
                    : 'max-h-0 opacity-0'
                }`}
              >
                <OutputIndicatorsDetailsTable
                  measurables={output?.output_measurables || []}
                  outputId={output.id}
                  projectId={projectId}
                />
              </div>
            </div>
          </div>
          <OutputForm
            isOpen={isOutputDialogOpen}
            onClose={() => setIsOutputDialogOpen(false)}
            output={output}
            projectId={projectId}
          />
        </FeatureCardLogframe>
      )}
    </div>
  );
}
