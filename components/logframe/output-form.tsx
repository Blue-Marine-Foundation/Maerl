'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Output } from '@/utils/types';
import { upsertOutput } from './server-actions';
import OutcomeMeasurableSelect from './outcome-measurable-select';

interface OutputFormProps {
  isOpen: boolean;
  onClose: () => void;
  output: Output | null;
  outcomeMeasurableId: number;
  projectId: number;
}

export default function OutputForm({
  isOpen,
  onClose,
  output,
  outcomeMeasurableId,
  projectId,
}: OutputFormProps) {
  const [description, setDescription] = useState(output?.description || '');
  const [code, setCode] = useState(output?.code || '');
  const [status, setStatus] = useState(output?.status || 'Not started');
  const [selectedMeasurableId, setSelectedMeasurableId] =
    useState<number>(outcomeMeasurableId);
  const [error, setError] = useState<string | null>(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    setDescription(output?.description || '');
    setCode(output?.code || '');
    setStatus(output?.status || 'Not started');
    setSelectedMeasurableId(outcomeMeasurableId);
    setError(null);
  }, [output, outcomeMeasurableId]);

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
      <DialogContent className='flex flex-col gap-4'>
        <DialogHeader>
          <DialogTitle>{output ? 'Edit Output' : 'Add Output'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <OutcomeMeasurableSelect
            value={selectedMeasurableId}
            projectId={projectId}
            onChange={(measurable) =>
              setSelectedMeasurableId(measurable?.id || outcomeMeasurableId)
            }
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
              placeholder='Enter output code (e.g. O1)'
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
      </DialogContent>
    </Dialog>
  );
}
