'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { upsertOutcome } from './server-actions';
import { Outcome } from '@/utils/types';
import CalloutCard from './callout-card';
import { logframeText } from './logframe-text';
import { Badge } from '../ui/badge';

interface OutcomeFormProps {
  isOpen: boolean;
  onClose: () => void;
  outcome: Outcome | null;
  projectId: number;
  existingCodes?: string[];
}

export default function OutcomeForm({
  isOpen,
  onClose,
  outcome,
  projectId,
  existingCodes = [],
}: OutcomeFormProps) {
  const [description, setDescription] = useState(outcome?.description || '');
  const [code, setCode] = useState(outcome?.code || '');
  const queryClient = useQueryClient();

  useEffect(() => {
    setDescription(outcome?.description || '');
    if (!outcome) {
      const numericCodes = existingCodes
        .filter((c) => typeof c === 'string' && c.startsWith('OC.'))
        .map((c) => {
          const n = parseInt(c.slice(3));
          return isNaN(n) ? null : n;
        })
        .filter((n): n is number => n !== null);
      let nextNum = 0;
      while (numericCodes.includes(nextNum)) nextNum++;
      setCode(`OC.${nextNum}`);
    } else {
      setCode(outcome.code || '');
    }
  }, [outcome, existingCodes]);

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
      code,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='flex max-h-[90vh] flex-col gap-4 overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>{outcome ? 'Edit Outcome' : 'Add Outcome'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <div className='mb-1 flex items-center gap-2 text-sm font-medium'>
            <span>Outcome code</span>
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
            content={logframeText.outcome.description}
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
