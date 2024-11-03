import { useState } from 'react';
import { Output, OutputMeasurable } from '@/utils/types';
import ActionButton from '../ui/action-button';
import OutputMeasurableForm from './output-measurable-form';

export default function OutputMeasurableTable({ output }: { output: Output }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMeasurable, setSelectedMeasurable] =
    useState<OutputMeasurable | null>(null);

  const handleEditMeasurable = (measurable: OutputMeasurable) => {
    setSelectedMeasurable(measurable);
    setIsDialogOpen(true);
  };

  const handleAddMeasurable = () => {
    setSelectedMeasurable(null);
    setIsDialogOpen(true);
  };

  return (
    <div className='flex flex-col gap-4'>
      <h4 className='text-sm font-medium text-muted-foreground'>Indicators</h4>

      {output.output_measurables?.map((measurable) => (
        <div
          key={measurable.id}
          className='grid grid-cols-[1fr_50px] items-baseline gap-4'
        >
          <div>
            <p className='text-sm'>{measurable.description}</p>
          </div>
          <div className='flex justify-end'>
            <ActionButton
              action='edit'
              variant='icon'
              onClick={() => handleEditMeasurable(measurable)}
            />
          </div>
        </div>
      ))}

      <div className='flex justify-center rounded-md border border-dashed bg-card/30 p-4'>
        <ActionButton
          action='add'
          label='Add indicator'
          onClick={handleAddMeasurable}
        />
      </div>
      <OutputMeasurableForm
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        measurable={selectedMeasurable}
        outputId={output.id}
        projectId={output.project_id}
      />
    </div>
  );
}
