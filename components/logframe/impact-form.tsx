'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { upsertImpact } from './server-actions';
import { Impact } from '@/utils/types';
import CalloutCard from './callout-card';

interface ImpactDialogProps {
  isOpen: boolean;
  onClose: () => void;
  impact: Impact | null;
  projectId: number;
}

export default function ImpactDialog({
  isOpen,
  onClose,
  impact,
  projectId,
}: ImpactDialogProps) {
  const [title, setTitle] = useState(impact?.title || '');
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newImpact: Partial<Impact>) => upsertImpact(newImpact),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logframe'] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ id: impact?.id, project_id: projectId, title });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='flex max-h-[90vh] flex-col gap-4 overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>{impact ? 'Edit Impact' : 'Add Impact'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <p className='text-muted-foreground'>
            Describe the long-term, high-level change you aim to achieve:
          </p>
          <textarea
            className='min-h-24 w-full rounded-md border bg-background px-4 py-2'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='Enter impact statement'
          />
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
            variant='success'
            label='Best practice'
            content='Use clear, concise language focusing on the desired change.'
          />
          <CalloutCard
            variant='warning'
            label='Avoid'
            content='Vague statements, focusing on project activities, describing work that needs to be done.'
          />

          <CalloutCard
            variant='info'
            label='Example'
            content='Seagrass ecosystems are protected and restored, providing ecosystem services to improve local community livelihoods and long-term climate change resilience.'
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
