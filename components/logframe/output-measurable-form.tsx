'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { OutputMeasurable, ImpactIndicator } from '@/utils/types';
import { upsertOutputMeasurable } from './server-actions';
import ImpactIndicatorSelect from '@/components/impact-indicators/impact-indicator-select';

interface OutputMeasurableFormProps {
  isOpen: boolean;
  onClose: () => void;
  measurable: OutputMeasurable | null;
  outputId: number;
  projectId: number;
}

export default function OutputMeasurableForm({
  isOpen,
  onClose,
  measurable,
  outputId,
  projectId,
}: OutputMeasurableFormProps) {
  const [code, setCode] = useState(measurable?.code || '');
  const [description, setDescription] = useState(measurable?.description || '');
  const [impactIndicatorId, setImpactIndicatorId] = useState<number | null>(
    measurable?.impact_indicator_id || null,
  );
  const [target, setTarget] = useState(measurable?.target || null);
  const [verification, setVerification] = useState(
    measurable?.verification || '',
  );
  const [assumptions, setAssumptions] = useState(measurable?.assumptions || '');

  const [selectedIndicator, setSelectedIndicator] =
    useState<ImpactIndicator | null>(null);

  useEffect(() => {
    setCode(measurable?.code || '');
    setDescription(measurable?.description || '');
    setImpactIndicatorId(measurable?.impact_indicator_id || null);
    setTarget(measurable?.target || null);
    setVerification(measurable?.verification || '');
    setAssumptions(measurable?.assumptions || '');
  }, [measurable]);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newMeasurable: Partial<OutputMeasurable>) =>
      upsertOutputMeasurable({
        ...newMeasurable,
        output_id: outputId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries();
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      id: measurable?.id,
      project_id: projectId,
      output_id: outputId,
      code,
      description,
      impact_indicator_id: impactIndicatorId,
      target,
      verification,
      assumptions,
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
            <label htmlFor='code' className='mb-1 block text-sm font-medium'>
              Code
            </label>
            <input
              id='code'
              className='w-full rounded-md border bg-background px-4 py-2'
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder='Enter indicator code'
            />
          </div>

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
              placeholder='Enter indicator description'
            />
          </div>

          <ImpactIndicatorSelect
            value={impactIndicatorId}
            onChange={(indicator) => {
              setImpactIndicatorId(indicator?.id || null);
              setSelectedIndicator(indicator);
            }}
          />

          <div>
            <label htmlFor='target' className='mb-1 block text-sm font-medium'>
              Target
            </label>
            <input
              id='target'
              type='number'
              className='w-full rounded-md border bg-background px-4 py-2'
              value={target || ''}
              onChange={(e) => setTarget(Number(e.target.value))}
              placeholder='Enter target value'
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
