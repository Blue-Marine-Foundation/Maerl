'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { upsertOutcome } from './server-action';
import { Outcome, OutcomeMeasurable } from '@/utils/types';

interface OutcomesFormProps {
  isOpen: boolean;
  onClose: () => void;
  outcome: Outcome | null;
  projectId: number;
}

export default function OutcomesForm({
  isOpen,
  onClose,
  outcome,
  projectId,
}: OutcomesFormProps) {
  const [description, setDescription] = useState(outcome?.description || '');
  const [measurables, setMeasurables] = useState<
    Omit<OutcomeMeasurable, 'id' | 'outcome_id' | 'code'>[]
  >(
    outcome?.outcome_measurables.map((m) => ({
      description: m.description || '',
      verification: m.verification || '',
      assumptions: m.assumptions || '',
    })) || [{ description: '', verification: '', assumptions: '' }],
  );

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newOutcome: Partial<Outcome>) => upsertOutcome(newOutcome),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logframe'] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Filter out empty measurables
    const filledMeasurables = measurables.filter(
      (m) =>
        m.description.trim() !== '' ||
        m.verification.trim() !== '' ||
        m.assumptions.trim() !== '',
    );

    // Generate codes for measurables
    const measurablesWithCodes = filledMeasurables.map((m, index) => ({
      ...m,
      code: `OC0.${index + 1}`,
    }));

    mutation.mutate({
      id: outcome?.id,
      project_id: projectId,
      description,
      code: 'OC.0',
      outcome_measurables: measurablesWithCodes,
    });
  };

  const handleMeasurableChange = (
    index: number,
    field: keyof Omit<OutcomeMeasurable, 'id' | 'outcome_id' | 'code'>,
    value: string,
  ) => {
    const updatedMeasurables = [...measurables];
    updatedMeasurables[index] = {
      ...updatedMeasurables[index],
      [field]: value,
    };
    setMeasurables(updatedMeasurables);
  };

  const addMeasurable = () => {
    setMeasurables([
      ...measurables,
      { description: '', verification: '', assumptions: '' },
    ]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='flex flex-col gap-4'>
        <DialogHeader>
          <DialogTitle>{outcome ? 'Edit Outcome' : 'Add Outcome'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <div>
            <label
              htmlFor='description'
              className='mb-1 block text-sm font-medium'
            >
              Description
            </label>
            <textarea
              id='description'
              className='min-h-24 w-full rounded-md border bg-background px-4 py-2'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='Enter outcome description'
            />
          </div>
          <div>
            <h4 className='mb-2 text-sm font-medium'>Measurables</h4>
            {measurables.map((measurable, index) => (
              <div key={index} className='mb-4 rounded-md border p-4'>
                <div className='mb-2'>
                  <label
                    htmlFor={`measurable-description-${index}`}
                    className='mb-1 block text-sm font-medium'
                  >
                    Description
                  </label>
                  <input
                    id={`measurable-description-${index}`}
                    className='w-full rounded-md border bg-background px-4 py-2'
                    value={measurable.description}
                    onChange={(e) =>
                      handleMeasurableChange(
                        index,
                        'description',
                        e.target.value,
                      )
                    }
                    placeholder='Enter measurable description'
                  />
                </div>
                <div className='mb-2'>
                  <label
                    htmlFor={`measurable-verification-${index}`}
                    className='mb-1 block text-sm font-medium'
                  >
                    Verification
                  </label>
                  <input
                    id={`measurable-verification-${index}`}
                    className='w-full rounded-md border bg-background px-4 py-2'
                    value={measurable.verification}
                    onChange={(e) =>
                      handleMeasurableChange(
                        index,
                        'verification',
                        e.target.value,
                      )
                    }
                    placeholder='Enter verification method'
                  />
                </div>
                <div>
                  <label
                    htmlFor={`measurable-assumptions-${index}`}
                    className='mb-1 block text-sm font-medium'
                  >
                    Assumptions
                  </label>
                  <input
                    id={`measurable-assumptions-${index}`}
                    className='w-full rounded-md border bg-background px-4 py-2'
                    value={measurable.assumptions}
                    onChange={(e) =>
                      handleMeasurableChange(
                        index,
                        'assumptions',
                        e.target.value,
                      )
                    }
                    placeholder='Enter assumptions'
                  />
                </div>
              </div>
            ))}
            <button
              type='button'
              onClick={addMeasurable}
              className='mt-2 rounded-md border px-4 py-2 text-sm'
            >
              Add Measurable
            </button>
          </div>
          <div className='flex justify-end'>
            <button
              className='flex items-center gap-2 rounded-md border border-blue-400 bg-blue-600 px-3 py-1 text-foreground transition-all hover:bg-blue-700'
              type='submit'
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
