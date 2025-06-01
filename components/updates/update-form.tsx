'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ImpactIndicator, OutputMeasurable, Update } from '@/utils/types';
import { upsertUpdate } from './server-actions';
import { Badge } from '../ui/badge';

interface UpdateFormProps {
  outputMeasurable: OutputMeasurable;
  impactIndicator: ImpactIndicator;
  projectId: number;
  update?: Update;
  isAdmin?: boolean;
}

export default function UpdateForm({
  outputMeasurable,
  impactIndicator,
  projectId,
  update,
  isAdmin = false,
}: UpdateFormProps) {
  const [description, setDescription] = useState(update?.description || '');
  const [value, setValue] = useState<number | null>(update?.value || null);
  const [type, setType] = useState(update?.type || 'Impact');
  const [link, setLink] = useState(update?.link || '');
  const [source, setSource] = useState(update?.source || '');
  const [date, setDate] = useState(
    update?.date || new Date().toISOString().split('T')[0],
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [adminReviewed, setAdminReviewed] = useState(
    update?.admin_reviewed || false,
  );
  const [reviewNote, setReviewNote] = useState(update?.review_note || '');
  const [verified, setVerified] = useState(update?.verified || false);
  const [duplicate, setDuplicate] = useState(update?.duplicate || false);
  const [valid, setValid] = useState(update?.valid || false);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newUpdate: Partial<Update>) => upsertUpdate(newUpdate),
    onSuccess: () => {
      queryClient.invalidateQueries();
      setSuccess('Update submitted successfully');
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
      if (!update) {
        // Only reset form if this is a new update
        setDescription('');
        setValue(null);
        setType('Impact');
        setLink('');
        setSource('');
        setDate(new Date().toISOString().split('T')[0]);
      }
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    mutation.mutate({
      id: update?.id, // Include the id if we're editing
      project_id: projectId,
      ...(outputMeasurable?.id !== undefined
        ? { output_measurable_id: outputMeasurable.id }
        : {}),
      ...(impactIndicator?.id !== undefined
        ? { impact_indicator_id: impactIndicator.id }
        : {}),
      description,
      value: Number(value),
      type,
      link,
      source,
      date,
      ...(isAdmin && {
        admin_reviewed: adminReviewed,
        review_note: reviewNote,
        verified,
        duplicate,
        valid,
      }),
    });
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-4 text-sm'>
      <div className='grid grid-cols-[200px_1fr] items-baseline gap-4'>
        <p className='text-sm font-medium'>Output Indicator</p>
        <p className='text-sm text-muted-foreground'>
          {outputMeasurable?.description}
        </p>
        {impactIndicator && (
          <>
            <p className='text-sm font-medium'>Impact Indicator</p>
            <p className='text-sm text-muted-foreground'>
              <Badge variant='default' className='mr-2'>
                {impactIndicator.indicator_code}
              </Badge>
              {impactIndicator.indicator_title}
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
                step={0.01}
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

        {isAdmin && (
          <>
            <label htmlFor='admin_reviewed' className='text-sm font-medium'>
              Admin Reviewed
            </label>
            <input
              type='checkbox'
              id='admin_reviewed'
              checked={adminReviewed}
              onChange={(e) => setAdminReviewed(e.target.checked)}
              className='mr-auto'
            />
            <label htmlFor='review_note' className='text-sm font-medium'>
              Review Note
            </label>
            <textarea
              id='review_note'
              className='min-h-12 rounded-md border bg-background px-4 py-2'
              value={reviewNote}
              onChange={(e) => setReviewNote(e.target.value)}
              placeholder='Add a review note (optional)'
            />
            <label htmlFor='verified' className='text-sm font-medium'>
              Verified
            </label>
            <input
              type='checkbox'
              id='verified'
              checked={verified}
              onChange={(e) => setVerified(e.target.checked)}
              className='mr-auto'
            />
            <label htmlFor='duplicate' className='text-sm font-medium'>
              Duplicate
            </label>
            <input
              type='checkbox'
              id='duplicate'
              checked={duplicate}
              onChange={(e) => setDuplicate(e.target.checked)}
              className='mr-auto'
            />
            <label htmlFor='valid' className='text-sm font-medium'>
              Valid
            </label>
            <input
              type='checkbox'
              id='valid'
              checked={valid}
              onChange={(e) => setValid(e.target.checked)}
              className='mr-auto'
            />
          </>
        )}
      </div>

      <div className='flex items-center justify-end gap-6'>
        {error && (
          <div className='rounded-md border border-red-600/50 bg-red-500/10 px-4 py-2 text-sm'>
            <p className='text-red-200'>{error}</p>
          </div>
        )}
        {success && (
          <div className='rounded-md border border-green-800 bg-green-600/10 px-4 py-2 text-sm'>
            <p>{success}</p>
          </div>
        )}
        <button
          className='flex items-center gap-2 rounded-md border border-blue-400 bg-blue-600 px-3 py-1 text-foreground transition-all hover:bg-blue-700'
          type='submit'
          disabled={mutation.isPending}
        >
          {mutation.isPending
            ? 'Submitting...'
            : update
              ? 'Save Changes'
              : 'Submit'}
        </button>
      </div>
    </form>
  );
}
