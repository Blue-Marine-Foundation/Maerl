'use client';

import { useState } from 'react';
import { OutcomeMeasurable } from '@/utils/types';
import FeatureCard from '@/components/ui/feature-card';
import OutcomeMeasurableForm from './outcome-measurable-form';
import EditButton from '@/components/ui/edit-button';
import { Badge } from '@/components/ui/badge';

export default function OutcomeMeasurableCard({
  measurables,
  outcomeId,
  projectId,
}: {
  measurables: OutcomeMeasurable[];
  outcomeId: number;
  projectId: number;
}) {
  const [isMeasurableDialogOpen, setIsMeasurableDialogOpen] = useState(false);
  const [selectedMeasurable, setSelectedMeasurable] =
    useState<OutcomeMeasurable | null>(null);

  const handleEditMeasurable = (measurable: OutcomeMeasurable) => {
    setSelectedMeasurable(measurable);
    setIsMeasurableDialogOpen(true);
  };

  const handleCloseMeasurableDialog = () => {
    setIsMeasurableDialogOpen(false);
    setSelectedMeasurable(null);
  };

  const handleAddMeasurable = () => {
    if (measurables) {
      const nextIndex = (measurables.length || 0) + 1;
      const nextCode = `OC0.${nextIndex}`;
      setSelectedMeasurable({ code: nextCode } as OutcomeMeasurable);
      setIsMeasurableDialogOpen(true);
    }
  };

  return (
    <>
      {measurables.length === 0 && (
        <div className='flex items-center justify-center rounded-md border border-dashed py-12'>
          <EditButton
            variant='add'
            label='Add outcome indicator'
            onClick={handleAddMeasurable}
          />
        </div>
      )}

      {measurables.length > 0 && (
        <div className='flex flex-col gap-8'>
          {measurables
            .sort((a, b) => a.code.localeCompare(b.code))
            .map((measurable) => (
              <FeatureCard
                key={measurable.id}
                title={`Outcome Indicator ${measurable.code.slice(3)}`}
                minHeight='100px'
              >
                <div className='grid grid-cols-[1fr_auto_1fr] items-baseline justify-between gap-4 text-sm'>
                  <div>
                    <Badge className='mr-2'>{measurable.code}</Badge>
                  </div>

                  <div className='flex grow flex-col gap-2'>
                    <p>{measurable.description}</p>
                    <p className='text-xs text-muted-foreground'>
                      Verification: {measurable.verification}
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      Assumptions: {measurable.assumptions}
                    </p>
                  </div>
                  <div className='flex justify-end'>
                    <EditButton
                      onClick={() => handleEditMeasurable(measurable)}
                    />
                  </div>
                </div>
              </FeatureCard>
            ))}
          <div className='flex items-start justify-center rounded-md border border-dashed bg-card/30 p-8'>
            <EditButton
              variant='add'
              label='Add outcome indicator'
              onClick={handleAddMeasurable}
            />
          </div>
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
