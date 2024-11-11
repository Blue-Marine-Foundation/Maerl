'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { upsertOutcome } from './server-actions';
import { Outcome } from '@/utils/types';

interface OutcomeFormProps {
  isOpen: boolean;
  onClose: () => void;
  outcome: Outcome | null;
  projectId: number;
}

export default function OutcomeForm({
  isOpen,
  onClose,
  outcome,
  projectId,
}: OutcomeFormProps) {
  const [description, setDescription] = useState(outcome?.description || '');
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
    mutation.mutate({
      id: outcome?.id,
      project_id: projectId,
      description,
      code: outcome?.code || 'OC.0',
    });
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
