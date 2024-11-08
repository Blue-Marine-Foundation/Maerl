'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { OutputMeasurable, Update } from '@/utils/types';
import { upsertUpdate } from './server-actions';
import { Badge } from '../ui/badge';

interface AddUpdateFormProps {
  isOpen: boolean;
  onClose: () => void;
  outputMeasurable: OutputMeasurable;
  projectId: number;
}

export default function AddUpdateForm({
  isOpen,
  onClose,
  outputMeasurable,
  projectId,
}: AddUpdateFormProps) {
  const [description, setDescription] = useState('');
  const [value, setValue] = useState<number | null>(null);
  const [type, setType] = useState('Impact');
  const [link, setLink] = useState('');
  const [source, setSource] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newUpdate: Partial<Update>) => upsertUpdate(newUpdate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logframe'] });
      onClose();
      // Reset form
      setDescription('');
      setValue(null);
      setType('Impact');
      setLink('');
      setSource('');
      setDate(new Date().toISOString().split('T')[0]);
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    mutation.mutate({
      project_id: projectId,
      output_measurable_id: outputMeasurable.id!,
      impact_indicator_id: outputMeasurable.impact_indicator_id!,
      description,
      value: Number(value),
      type,
      link,
      source,
      date,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='flex flex-col gap-4'>
        <DialogHeader>
          <DialogTitle>Add Update</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='flex flex-col gap-4 text-sm'>
          <div className='grid grid-cols-[200px_1fr] items-baseline gap-4'>
            <p className='text-sm font-medium'>Output Indicator</p>
            <p className='text-sm text-muted-foreground'>
              <Badge variant='default' className='mr-2'>
                {outputMeasurable.code}
              </Badge>{' '}
              {outputMeasurable.description}
            </p>
            {outputMeasurable.impact_indicator_id && (
              <>
                <p className='text-sm font-medium'>Impact Indicator</p>
                <p className='text-sm text-muted-foreground'>
                  <Badge variant='default' className='mr-2'>
                    {outputMeasurable.impact_indicators?.indicator_code}
                  </Badge>
                  {outputMeasurable.impact_indicators?.indicator_title}
                </p>
              </>
            )}
            <label htmlFor='date' className='text-sm font-medium'>
              Date
            </label>

            <input
              type='date'
              id='date'
              className='rounded-md border bg-background px-4 py-2'
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <label htmlFor='type' className='text-sm font-medium'>
              Update type
            </label>
            <select
              id='type'
              className='rounded-md border bg-background px-4 py-2'
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value='Impact'>Impact</option>
              <option value='Progress'>Progress</option>
            </select>

            <label htmlFor='description' className='text-sm font-medium'>
              Description
            </label>
            <textarea
              id='description'
              className='min-h-24 rounded-md border bg-background px-4 py-2'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='Describe the update'
            />

            {type === 'Impact' && (
              <>
                <label htmlFor='value' className='text-sm font-medium'>
                  Value
                </label>
                <div className='flex items-center justify-between gap-2'>
                  <span className='text-sm text-muted-foreground'>
                    {outputMeasurable.impact_indicators?.indicator_unit}
                  </span>
                  <input
                    type='number'
                    id='value'
                    className='grow rounded-md border bg-background px-4 py-2'
                    value={value ?? ''}
                    onChange={(e) =>
                      setValue(e.target.value ? Number(e.target.value) : null)
                    }
                    min={0}
                    placeholder='Enter value'
                  />
                </div>

                <label htmlFor='link' className='text-sm font-medium'>
                  Link
                </label>

                <input
                  id='link'
                  className='rounded-md border bg-background px-4 py-2'
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder='Enter link to evidence'
                />
              </>
            )}
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
