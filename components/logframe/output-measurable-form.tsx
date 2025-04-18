'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { OutputMeasurable, ImpactIndicator } from '@/utils/types';
import { upsertOutputMeasurable } from './server-actions';
import ImpactIndicatorSelect from '@/components/impact-indicators/impact-indicator-select';
import CalloutCard from './callout-card';
import { Badge } from '@/components/ui/badge';

interface OutputMeasurableFormProps {
  isOpen: boolean;
  onClose: () => void;
  measurable: OutputMeasurable | null;
  outputId: number;
  projectId: number;
  existingCodes?: string[];
  outputCode?: string;
}

export default function OutputMeasurableForm({
  isOpen,
  onClose,
  measurable,
  outputId,
  projectId,
  existingCodes = [],
  outputCode = '',
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
    setDescription(measurable?.description || '');
    setImpactIndicatorId(measurable?.impact_indicator_id || null);
    setTarget(measurable?.target || null);
    setVerification(measurable?.verification || '');
    setAssumptions(measurable?.assumptions || '');
    // Auto-assign code for new measurable
    if (!measurable) {
      // Try to get the output code prefix (O.x)
      let prefix = '';
      if (outputCode && outputCode.startsWith('O.')) {
        prefix = outputCode;
      } else if (existingCodes.length > 0) {
        const match = existingCodes[0]?.match(/^(O\.\d+)\./);
        if (match) prefix = match[1];
      }
      // fallback: try to extract from outputId (not robust, but fallback)
      if (!prefix) prefix = `O.${outputId}`;
      // Find all y's for this output
      const yNumbers = existingCodes
        .filter((c) => typeof c === 'string' && c.startsWith(`${prefix}.`))
        .map((c) => {
          const parts = c.split('.');
          const n = parseInt(parts[2]);
          return isNaN(n) ? null : n;
        })
        .filter((n): n is number => n !== null);
      let nextY = 1;
      while (yNumbers.includes(nextY)) nextY++;
      setCode(`${prefix}.${nextY}`);
    } else {
      setCode(measurable.code || '');
    }
  }, [measurable, existingCodes, outputCode, outputId]);

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
      <DialogContent className='flex max-h-[90vh] flex-col gap-4 overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>
            {measurable ? 'Edit Indicator' : 'Add Indicator'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <div className='mb-1 flex items-center gap-2 text-sm font-medium'>
            <span>Indicator code</span>
            <Badge className='text-base'>{code}</Badge>
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
        <div className='mt-16 flex flex-col gap-4 text-sm text-foreground/90'>
          <CalloutCard
            variant='info'
            label='Description'
            content='Output indicators are something you will measure to assess progress towards completing each output (not what is to be achieved). Each output can have more than one indicator though it is good practice not to have more than three per output. Output indicators will be measurable within the timeframe of the project, they need to be specific, usable and clearly verifiable. Indicators can be both quantitative and qualitative.'
          />
          <CalloutCard
            variant='info'
            label='Example'
            content='Output indicator example (quantitative): "Number of individuals attending sustainable fishing workshops (disaggregated by gender and disability status)". Output indicator example (qualitative): "Fisher knowledge levels post sustainable fishing workshops."'
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
