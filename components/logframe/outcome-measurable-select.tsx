'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchOutcomeMeasurables } from './server-actions';
import { useState, useEffect } from 'react';
import type { OutcomeMeasurable } from '@/utils/types';

interface OutcomeMeasurableSelectProps {
  value: number;
  projectId: number;
  onChange: (measurable: OutcomeMeasurable | null) => void;
}

export default function OutcomeMeasurableSelect({
  value,
  projectId,
  onChange,
}: OutcomeMeasurableSelectProps) {
  const { data: measurables, isLoading } = useQuery({
    queryKey: ['outcomeMeasurables', projectId],
    queryFn: () => fetchOutcomeMeasurables(projectId),
  });

  const [selectedMeasurable, setSelectedMeasurable] =
    useState<OutcomeMeasurable | null>(null);

  useEffect(() => {
    if (measurables && value) {
      const found = measurables.find((m) => m.id === value);
      setSelectedMeasurable(found || null);
    }
  }, [measurables, value]);

  const truncateText = (text: string, maxLength: number = 60) => {
    return text?.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  const handleChange = (measurableId: string) => {
    const selected =
      measurables?.find((m) => m.id === Number(measurableId)) || null;
    setSelectedMeasurable(selected);
    onChange(selected);
  };

  return (
    <div>
      <label
        htmlFor='outcomeMeasurable'
        className='mb-1 block text-sm font-medium'
      >
        Outcome Measurable
      </label>
      <select
        id='outcomeMeasurable'
        className='w-full rounded-md border bg-background px-4 py-2'
        value={selectedMeasurable?.id || ''}
        onChange={(e) => handleChange(e.target.value)}
        disabled={isLoading}
        required={false}
      >
        <option value=''>Select an outcome measurable...</option>
        {isLoading ? (
          <option>Loading outcome measurables...</option>
        ) : measurables?.length ? (
          measurables.map((measurable) => (
            <option key={measurable.id} value={measurable.id}>
              {measurable.code} - {truncateText(measurable.description)}
            </option>
          ))
        ) : (
          <option>No outcome measurables found</option>
        )}
      </select>
    </div>
  );
}
