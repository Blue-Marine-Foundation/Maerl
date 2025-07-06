'use client';

import { useState } from 'react';
import { Output, OutputMeasurable, Update } from '@/utils/types';
import { upsertUpdate } from '@/api/upsert-updates';
import { Badge } from '@/components/ui/badge';
import { sortOutputs } from '@/utils/sort-outputs';

export default function AddGeneralUpdateForm({
  projectId,
  outputs,
}: {
  projectId: number;
  outputs: Output[];
}) {
  const [selectedOutput, setSelectedOutput] = useState<Output | null>(null);
  const [selectedMeasurable, setSelectedMeasurable] =
    useState<OutputMeasurable | null>(null);
  const [description, setDescription] = useState('');
  const [value, setValue] = useState<number | null>(null);
  const [type, setType] = useState('Progress');
  const [link, setLink] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedUpdates, setSubmittedUpdates] = useState<Partial<Update>[]>(
    [],
  );

  const sortedOutputs = sortOutputs(outputs);
  const outputMeasurables = selectedOutput?.output_measurables ?? [];

  const resetForm = () => {
    setSelectedOutput(null);
    setSelectedMeasurable(null);
    setDescription('');
    setValue(null);
    setType('Progress');
    setLink('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Only validate measurable if an output is selected
    if (selectedOutput && !selectedMeasurable) {
      setError('Please select an output measurable');
      return;
    }

    try {
      setIsSubmitting(true);
      const updateData = {
        project_id: projectId,
        output_measurable_id: selectedOutput ? selectedMeasurable?.id! : null,
        impact_indicator_id: selectedMeasurable?.impact_indicator_id,
        description,
        value: Number(value),
        type,
        link,
        date,
      };

      await upsertUpdate(updateData);
      setSubmittedUpdates((prev) => [
        {
          date: updateData.date,
          description: updateData.description,
          edited_at: new Date().toISOString(),
        } as Partial<Update>,
        ...prev,
      ]);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='flex items-start justify-center gap-8'>
      <form
        onSubmit={handleSubmit}
        className='flex max-w-3xl grow flex-col gap-3 rounded-lg bg-card p-5 text-sm'
      >
        <div className='grid grid-cols-[200px_1fr] items-baseline gap-4'>
          <label htmlFor='output' className='text-sm font-medium'>
            Output
          </label>
          <select
            id='output'
            className='max-w-md overflow-ellipsis rounded-md border bg-background px-4 py-2'
            value={selectedOutput?.id || ''}
            onChange={(e) => {
              if (e.target.value === '') {
                setSelectedOutput(null);
                setSelectedMeasurable(null);
                setType('Progress');
                return;
              }
              const output = sortedOutputs.find(
                (o) => o?.id === Number(e.target.value),
              );
              setSelectedOutput(output || null);
              setSelectedMeasurable(null);
              setType('Impact');
            }}
          >
            <option value=''>General update</option>
            {sortedOutputs.map((output) => (
              <option key={output?.id} value={output?.id}>
                {output?.code} - {output?.description}
              </option>
            ))}
          </select>

          {selectedOutput && (
            <>
              <label htmlFor='measurable' className='text-sm font-medium'>
                Output Indicator
              </label>
              <select
                id='measurable'
                className='max-w-md overflow-ellipsis rounded-md border bg-background px-4 py-2'
                value={selectedMeasurable?.id || ''}
                onChange={(e) => {
                  const measurable = outputMeasurables.find(
                    (m) => m.id === Number(e.target.value),
                  );
                  setSelectedMeasurable(measurable || null);
                }}
              >
                <option value=''>Select an output indicator...</option>
                {outputMeasurables.map((measurable) => (
                  <option key={measurable.id} value={measurable.id}>
                    {measurable.code} - {measurable.description}
                  </option>
                ))}
              </select>
            </>
          )}

          {selectedMeasurable?.impact_indicator_id && (
            <>
              <p className='text-sm font-medium'>Impact Indicator</p>
              <p className='text-sm text-muted-foreground'>
                <Badge variant='default' className='mr-2'>
                  {selectedMeasurable.impact_indicators?.indicator_code}
                </Badge>
                {selectedMeasurable.impact_indicators?.indicator_title}
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
            value={!selectedOutput ? 'Progress' : type}
            onChange={(e) => setType(e.target.value)}
            disabled={!selectedOutput}
          >
            <option value='Progress'>Progress</option>
            <option value='Impact'>Impact</option>
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
                  {selectedMeasurable?.impact_indicators?.indicator_unit}
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
                  step={0.001}
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
            <div className='rounded-md border border-red-600/50 bg-red-500/10 px-4 py-2 text-sm'>
              <p className='text-red-200'>{error}</p>
            </div>
          )}
          <button
            className='flex items-center gap-2 rounded-md border border-blue-400 bg-blue-600 px-3 py-1 text-foreground transition-all hover:bg-blue-700'
            type='submit'
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>

      {submittedUpdates.length > 0 && (
        <div className='grow rounded-lg bg-card p-4'>
          <h3 className='mb-2 font-medium'>Submitted updates</h3>
          <div className='flex flex-col gap-3 rounded-md bg-muted p-4'>
            {submittedUpdates.map((update) => (
              <div
                key={update.edited_at}
                className='grid grid-cols-[100px_1fr] items-baseline gap-2'
              >
                <p className='text-sm text-muted-foreground'>{update.date}</p>
                <p className='text-sm'>{update.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
