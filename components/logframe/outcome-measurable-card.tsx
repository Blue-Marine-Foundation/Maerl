'use client';

import { useState } from 'react';
import { Outcome, OutcomeMeasurable } from '@/utils/types';
import FeatureCard from '@/components/ui/feature-card';
import OutcomeForm from './outcome-form';
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
          <OutcomeMeasurableForm
            isOpen={isMeasurableDialogOpen}
            onClose={handleCloseMeasurableDialog}
            measurable={selectedMeasurable}
            outcomeId={outcomeId}
          />
        </div>
      )}

      {measurables.length > 0 && (
        <FeatureCard title='Outcome Indicators'>
          {measurables.map((measurable) => (
            <div key={measurable.id} className='mb-2 text-sm'>
              <div className='flex items-start justify-between'>
                <div>
                  <p>
                    <Badge className='mr-2'>{measurable.code}</Badge>
                    {measurable.description}
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    Verification: {measurable.verification}
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    Assumptions: {measurable.assumptions}
                  </p>
                </div>
                <EditButton onClick={() => handleEditMeasurable(measurable)} />
              </div>
            </div>
          ))}
          <OutcomeMeasurableForm
            isOpen={isMeasurableDialogOpen}
            onClose={handleCloseMeasurableDialog}
            measurable={selectedMeasurable}
            outcomeId={outcomeId}
          />
        </FeatureCard>
      )}
    </>
  );
}
