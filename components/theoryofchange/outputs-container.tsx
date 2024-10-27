'use client';

import { useState } from 'react';
import { Output } from '@/utils/types';
import OutputCard from './outputs-card';
import OutputForm from './output-form';
import ActionButton from '../ui/action-button';

export default function OutputsContainer({
  outputs,
  outcomeMeasurableId,
  projectId,
}: {
  outputs: Output[];
  outcomeMeasurableId: number;
  projectId: number;
}) {
  const [isOutputDialogOpen, setIsOutputDialogOpen] = useState(false);
  const [selectedOutput, setSelectedOutput] = useState<Output | null>(null);

  const handleEditOutput = (output: Output) => {
    setSelectedOutput(output);
    setIsOutputDialogOpen(true);
  };

  const handleCloseOutputDialog = () => {
    setIsOutputDialogOpen(false);
    setSelectedOutput(null);
  };

  const handleAddOutput = () => {
    if (outputs) {
      const nextCode = `O.X`;
      setSelectedOutput({ code: nextCode } as Output);
      setIsOutputDialogOpen(true);
    }
  };

  return (
    <div className='flex flex-col gap-4'>
      <h4 className='text-sm font-medium text-muted-foreground'>Outputs</h4>
      {outputs
        .sort((a, b) => a.code.localeCompare(b.code))
        .map((output) => (
          <OutputCard
            key={output.id}
            output={output}
            onEdit={handleEditOutput}
          />
        ))}
      <div className='flex justify-center rounded-md border border-dashed bg-background/30 p-4'>
        <ActionButton
          action='add'
          label='Add output'
          onClick={handleAddOutput}
        />
      </div>
      <OutputForm
        isOpen={isOutputDialogOpen}
        onClose={handleCloseOutputDialog}
        output={selectedOutput}
        outcomeMeasurableId={outcomeMeasurableId}
        projectId={projectId}
      />
    </div>
  );
}
