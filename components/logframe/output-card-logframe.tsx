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

  const outputIndicators =
    output?.output_measurables?.sort(
      (a, b) => a.code?.localeCompare(b.code ?? '') ?? 0,
    ) || [];

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
          href={`/projects/yavin4/logframe/output?id=${output.id}`}
        >
          <div className='flex w-full grow flex-col items-start justify-between gap-4'>
            <div className='flex w-full flex-row justify-between gap-8 rounded-md bg-card pb-6'>
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
              measurables={outputIndicators}
              outputId={output.id}
              projectId={projectId}
            />
          </div>

          <OutputForm
            isOpen={isOutputDialogOpen}
            onClose={() => setIsOutputDialogOpen(false)}
            output={output}
            projectId={projectId}
            outcomeMeasurableId={output?.outcome_measurable_id}
          />
        </FeatureCardLogframe>
      )}
    </div>
  );
}
