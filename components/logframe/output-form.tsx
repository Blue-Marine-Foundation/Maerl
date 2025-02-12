'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Output } from '@/utils/types';
import { upsertOutput } from './server-actions';
import OutcomeMeasurableSelect from './outcome-measurable-select';
import CalloutCard from './callout-card';

interface OutputFormProps {
  isOpen: boolean;
  onClose: () => void;
  output: Output | null;
  projectId: number;
}

export default function OutputForm({
  isOpen,
  onClose,
  output,
  projectId,
}: OutputFormProps) {
  const [description, setDescription] = useState(output?.description || '');
  const [code, setCode] = useState(output?.code || '');
  const [status, setStatus] = useState(output?.status || 'Not started');
  const [selectedMeasurableId, setSelectedMeasurableId] = useState<
    number | undefined
  >(output?.outcome_measurable_id);
  const [error, setError] = useState<string | null>(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    setDescription(output?.description || '');
    setCode(output?.code || '');
    setStatus(output?.status || 'Not started');
    setSelectedMeasurableId(output?.outcome_measurable_id);
    setError(null);
  }, [output]);

  const mutation = useMutation({
    mutationFn: async (newOutput: Partial<Output>) => {
      const response = await upsertOutput({
        ...newOutput,
        outcome_measurable_id: selectedMeasurableId,
      });

      if (!response.success) {
        throw new Error(response.error);
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logframe'] });
      onClose();
    },
    onError: (error: Error) => {
      setError(error.message || 'An unexpected error occurred');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    mutation.mutate({
      id: output?.id,
      project_id: projectId,
      code,
      description,
      status,
      outcome_measurable_id: selectedMeasurableId,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='flex max-h-[90vh] flex-col gap-4 overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>{output ? 'Edit Output' : 'Add Output'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <OutcomeMeasurableSelect
            value={selectedMeasurableId || 0}
            projectId={projectId}
            onChange={(measurable) => setSelectedMeasurableId(measurable?.id)}
          />
          <div>
            <label htmlFor='code' className='mb-1 block text-sm font-medium'>
              Code
            </label>
            <input
              id='code'
              className='w-full rounded-md border bg-background px-4 py-2'
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder='Enter output code (e.g. 0.10 for Output 10)'
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
              placeholder='Enter output description'
            />
          </div>
          <div>
            <label htmlFor='status' className='mb-1 block text-sm font-medium'>
              Status
            </label>
            <select
              id='status'
              className='w-full rounded-md border bg-background px-4 py-2'
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value='Not started'>Not Started</option>
              <option value='Delayed'>Delayed</option>
              <option value='In progress'>In Progress</option>
              <option value='Complete'>Complete</option>
              <option value='Abandoned'>Abandoned</option>
            </select>
          </div>
          <div className='flex items-center justify-end gap-6'>
            {error && (
              <div className='rounded-md border border-red-800 bg-red-600/10 px-4 py-2 text-sm'>
                <p>{error}</p>
              </div>
            )}
            <button
              className='flex items-center gap-2 rounded-md border border-blue-400 bg-blue-600 px-3 py-1 text-foreground transition-all hover:bg-blue-700'
              type='submit'
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
        <div className='mt-2 flex flex-col gap-4 text-sm text-foreground/90'>
          <CalloutCard
            variant='info'
            label='Description'
            content='Outputs are specific, direct deliverables that result from the project’s activities. The Outputs should be fully within the control of the project, providing the assumptions hold. Taken together, the outputs should provide the conditions necessary to achieve the Outcome. Wherever possible it should be clear who will benefit from the output, and how they will benefit.    '
          />
          <CalloutCard
            variant='info'
            label='Example'
            content='5000 households trained in sustainable fishing practices to enhance food security and seagrass meadow restoration.'
          />
          <CalloutCard
            variant='success'
            label='Best practice'
            content='Think of outputs as specific deliverables you aim to achieve throughout the life of a project. Think of them as a result of many day-to-day activities.'
          />
          <CalloutCard
            variant='warning'
            label='Avoid'
            content="Don't confused outputs with activities. Activities are things that lead you to an output. For example, if your output is x number of people trained in sustainable fishing practices, the activities to achieve that include attending training courses, assessing the skills that were gained, setting up a course etc."
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
