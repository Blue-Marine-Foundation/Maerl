'use client';

import { useState } from 'react';
import { OutcomeMeasurable, Output } from '@/utils/types';
import OutcomeMeasurableForm from './outcome-measurable-form';
import OutputsContainer from './outputs-container';

export default function OutcomeMeasurableCard({
  outcomeId,
  projectId,
  outputs,
}: {
  outcomeId: number;
  projectId: number;
  outputs: Output[];
}) {
  const [isMeasurableDialogOpen, setIsMeasurableDialogOpen] = useState(false);
  const [selectedMeasurable, setSelectedMeasurable] =
    useState<OutcomeMeasurable | null>(null);

  const handleCloseMeasurableDialog = () => {
    setIsMeasurableDialogOpen(false);
    setSelectedMeasurable(null);
  };

  return (
    <>
      {outputs.length > 0 && (
        <div className='flex flex-col gap-8'>
          <OutputsContainer outputs={outputs} />
        </div>
      )}
      <OutcomeMeasurableForm
        isOpen={isMeasurableDialogOpen}
        onClose={handleCloseMeasurableDialog}
        measurable={selectedMeasurable}
        outcomeId={outcomeId}
        projectId={projectId}
      />
    </>
  );
}
