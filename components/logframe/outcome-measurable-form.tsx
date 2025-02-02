'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { OutcomeMeasurable } from '@/utils/types';
import { upsertOutcomeMeasurable } from './server-actions';

interface OutcomeMeasurableFormProps {
  isOpen: boolean;
  onClose: () => void;
  measurable: OutcomeMeasurable | null;
  outcomeId: number;
  projectId: number;
}

export default function OutcomeMeasurableForm({
  isOpen,
  onClose,
  measurable,
  outcomeId,
  projectId,
}: OutcomeMeasurableFormProps) {
  // Initialize state with measurable values if editing
  const [description, setDescription] = useState(measurable?.description || '');
  const [verification, setVerification] = useState(
    measurable?.verification || '',
  );
  const [assumptions, setAssumptions] = useState(measurable?.assumptions || '');
  const [target, setTarget] = useState(measurable?.target?.toString() || '');
  const [impactIndicator, setImpactIndicator] = useState(
    measurable?.impact_indicator?.indicator_title || '',
  );

  // Reset form when measurable prop changes
  useEffect(() => {
    setDescription(measurable?.description || '');
    setVerification(measurable?.verification || '');
    setAssumptions(measurable?.assumptions || '');
    setTarget(measurable?.target?.toString() || '');
    setImpactIndicator(measurable?.impact_indicator?.indicator_title || '');
  }, [measurable]);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newMeasurable: Partial<OutcomeMeasurable>) =>
      upsertOutcomeMeasurable({
        ...newMeasurable,
        outcome_id: outcomeId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logframe'] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      id: measurable?.id,
      project_id: projectId,
      code: measurable?.code,
      description,
      verification,
      assumptions,
      target: target ? Number(target) : null,
      // impact_indicator: {
      //   // @ts-expect-error - TODO: Confirm schema for impact_indicator
      //   id: measurable?.impact_indicator?.id || null,
      //   indicator_code: measurable?.impact_indicator?.indicator_code || '',
      //   indicator_title: measurable?.impact_indicator?.indicator_title || '',
      //   indicator_unit: measurable?.impact_indicator?.indicator_unit || '',
      // },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='flex flex-col gap-4'>
        <DialogHeader>
          <DialogTitle>
            {measurable ? 'Edit Indicator' : 'Add Indicator'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <div>
            <label
              htmlFor='description'
              className='mb-1 block text-sm font-medium'
            >
              Measurable Indicator
            </label>
            <input
              id='description'
              className='w-full rounded-md border bg-background px-4 py-2'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='Enter indicator description'
            />
          </div>
          <div>
            <label
              htmlFor='verification'
              className='mb-1 block text-sm font-medium'
            >
              Verification
            </label>
            <input
              id='verification'
              className='w-full rounded-md border bg-background px-4 py-2'
              value={verification}
              onChange={(e) => setVerification(e.target.value)}
              placeholder='Enter verification method'
            />
          </div>
          <div>
            <label
              htmlFor='assumptions'
              className='mb-1 block text-sm font-medium'
            >
              Assumptions
            </label>
            <input
              id='assumptions'
              className='w-full rounded-md border bg-background px-4 py-2'
              value={assumptions}
              onChange={(e) => setAssumptions(e.target.value)}
              placeholder='Enter assumptions'
            />
          </div>
          <div>
            <label htmlFor='target' className='mb-1 block text-sm font-medium'>
              Target
            </label>
            <input
              id='target'
              className='w-full rounded-md border bg-background px-4 py-2'
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder='Enter target'
            />
          </div>
          <div>
            <label
              htmlFor='impactIndicator'
              className='mb-1 block text-sm font-medium'
            >
              Impact Indicator
            </label>
            <input
              id='impactIndicator'
              className='w-full rounded-md border bg-background px-4 py-2'
              value={impactIndicator}
              onChange={(e) => setImpactIndicator(e.target.value)}
              placeholder='Enter impact indicator'
            />
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
