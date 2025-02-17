'use client';

import { useState } from 'react';
import { Output } from '@/utils/types';
import ActionButton from '@/components/ui/action-button';
import FeatureCardLogframe from './feature-card-logframe';
import OutputForm from './output-form';
import OutputIndicatorsTable from './output-indicators-table';
import { extractOutputCodeNumber } from './extractOutputCodeNumber';
import AddOutputButton from './add-output-button';

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

  return (
    <div className='relative flex flex-col gap-8'>
      {!output && canEdit && (
        <FeatureCardLogframe
          title='Output'
          minHeight='100%'
          variant='output'
          tooltipText="Outputs are specific, direct deliverables that result from the project's activities. The Outputs should be fully within the control of the project, providing the assumptions hold. Taken together, the outputs should provide the conditions necessary to achieve the Outcome. Wherever possible it should be clear who will benefit from the output, and how they will benefit."
        >
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
          variant='output'
          minHeight='100%'
          href={`/projects/yavin4/logframe/output?id=${output.id}`}
          tooltipText="Outputs are specific, direct deliverables that result from the project's activities. The Outputs should be fully within the control of the project, providing the assumptions hold. Taken together, the outputs should provide the conditions necessary to achieve the Outcome. Wherever possible it should be clear who will benefit from the output, and how they will benefit."
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
            <OutputIndicatorsTable
              measurables={output?.output_measurables || []}
              outputId={output.id}
              projectId={projectId}
            />
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
