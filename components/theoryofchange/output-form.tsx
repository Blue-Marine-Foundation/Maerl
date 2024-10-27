'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Output } from '@/utils/types';
import { upsertOutput } from './server-action';

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

  // Reset form when output prop changes
  useEffect(() => {
    setDescription(output?.description || '');
    setCode(output?.code || '');
  }, [output]);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newOutput: Partial<Output>) =>
      upsertOutput({
        ...newOutput,
        outcome_measurable_id: outcomeMeasurableId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logframe'] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      id: output?.id,
      project_id: projectId,
      code,
      description,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='flex flex-col gap-4'>
        <DialogHeader>
          <DialogTitle>{output ? 'Edit Output' : 'Add Output'}</DialogTitle>
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
