'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { upsertOutcome } from './server-actions';
import { Outcome } from '@/utils/types';
import CalloutCard from './callout-card';

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
      <DialogContent className='flex max-h-[90vh] flex-col gap-4 overflow-y-auto'>
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
        <div className='mt-16 flex flex-col gap-4 text-sm text-foreground/90'>
          <CalloutCard
            variant='info'
            label='Description'
            content='The outcome statement is the overarching objective of the project. It is what is expected to be achieved as a result of the project. There is typically one outcome for a project, although there may be several indicators to measure its achievement. The outcome is within the control of the project, providing the assumptions hold (e.g. maintained political will).'
          />
          <CalloutCard
            variant='success'
            label='Best practice'
            content='Have one outcome statement that can be measured. It should be within the control of the project, providing it operates within our assumptions.'
          />
          <CalloutCard
            variant='warning'
            label='Avoid'
            content='Long, difficult statements or lots of sentences.'
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
