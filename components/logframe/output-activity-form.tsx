'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Output, OutputActivity } from '@/utils/types';
import CalloutCard from './callout-card';
import { upsertOutputActivity } from './server-actions';
import { logframeText } from './logframe-text';

interface OutputActivityFormProps {
  isOpen: boolean;
  onClose: () => void;
  activity: OutputActivity | null;
  activities: OutputActivity[];
  projectId: number;
  output: Output;
}

export default function OutputActivityForm({
  isOpen,
  onClose,
  activity,
  activities,
  projectId,
  output,
}: OutputActivityFormProps) {
  const [description, setDescription] = useState(
    activity?.activity_description || '',
  );

  const [status, setStatus] = useState(
    activity?.activity_status || 'Not started',
  );

  const queryClient = useQueryClient();

  useEffect(() => {
    setDescription(activity?.activity_description || '');
    setStatus(activity?.activity_status || 'Not started');
  }, [activity]);

  const mutation = useMutation({
    mutationFn: (newActivity: Partial<OutputActivity>) =>
      upsertOutputActivity(newActivity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logframe'] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextActivityNumber = activity?.id
      ? undefined
      : (activities.length + 1).toString().padStart(2, '0');

    mutation.mutate({
      id: activity?.id,
      activity_code: activity?.activity_code || `A${nextActivityNumber}`,
      activity_description: description,
      activity_status: status,
      output_id: output.id,
      project_id: projectId,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='flex max-h-[90vh] flex-col gap-4 overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>
            {activity ? 'Edit Activity' : 'Add Activity'}
          </DialogTitle>
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
              placeholder='Enter activity description'
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
            label='Activities'
            content={logframeText.activity.description}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
