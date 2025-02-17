'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Activity, OutputMeasurable } from '@/utils/types';
import CalloutCard from './callout-card';
import { fetchActivities, upsertActivity } from '../updates/server-actions';

interface ActivityFormProps {
  isOpen: boolean;
  onClose: () => void;
  activity: Activity | null;
  outputMeasurables: OutputMeasurable[];
}

export default function ActivityForm({
  isOpen,
  onClose,
  activity,
  outputMeasurables,
}: ActivityFormProps) {
  const [description, setDescription] = useState(
    activity?.activity_description || '',
  );
  const [selectedIndicatorId, setSelectedIndicatorId] = useState(
    activity?.output_indicator_id || '',
  );

  const queryClient = useQueryClient();

  const { data: existingActivities = [] } = useQuery({
    queryKey: ['activities', selectedIndicatorId],
    queryFn: () => fetchActivities(Number(selectedIndicatorId)),
  });

  const mutation = useMutation({
    mutationFn: (newActivity: Partial<Activity>) => upsertActivity(newActivity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextActivityNumber = activity?.id
      ? undefined
      : (existingActivities.length + 1).toString().padStart(2, '0');

    mutation.mutate({
      id: activity?.id,
      output_indicator_id: Number(selectedIndicatorId),
      activity_description: description,
      activity_status: activity?.activity_status || 'pending',
      activity_code: activity?.activity_code || `A${nextActivityNumber}`,
    });
  };

  const truncateText = (text: string, maxLength: number = 60) => {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
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
            {/* TODO: remove the input to select the output measurable indicator */}
            <label
              htmlFor='indicator'
              className='mb-1 block text-sm font-medium'
            >
              Related Indicator
            </label>
            <select
              id='indicator'
              className='w-full rounded-md border bg-background px-4 py-2'
              value={selectedIndicatorId}
              onChange={(e) => setSelectedIndicatorId(e.target.value)}
              required
            >
              <option value=''>Select an indicator</option>
              {outputMeasurables.map((indicator) => (
                <option key={indicator.id} value={indicator.id}>
                  {indicator.description}
                </option>
              ))}
            </select>
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
              placeholder='Enter activity description'
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
            label='Activities'
            content='Activities are specific actions or tasks that contribute to achieving the output. They should be clear, concrete, and measurable.'
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
