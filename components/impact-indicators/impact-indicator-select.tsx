'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchImpactIndicators } from './server-actions';
import { useState, useEffect } from 'react';
import type { ImpactIndicator } from '@/utils/types';
interface ImpactIndicatorSelectProps {
  value: number | null;
  onChange: (indicator: ImpactIndicator | null) => void;
}

export default function ImpactIndicatorSelect({
  value,
  onChange,
}: ImpactIndicatorSelectProps) {
  const { data: indicators } = useQuery({
    queryKey: ['impactIndicators'],
    queryFn: () => fetchImpactIndicators(),
  });

  const [selectedIndicator, setSelectedIndicator] =
    useState<ImpactIndicator | null>(null);

  useEffect(() => {
    if (indicators && value) {
      const found = indicators.find((ind) => ind.id === value);
      setSelectedIndicator(found || null);
    }
  }, [indicators, value]);

  const isSelectable = (code: string) => {
    return code.split('.').length === 3;
  };

  const truncateText = (text: string, maxLength: number = 60) => {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  const handleChange = (indicatorId: string) => {
    const selected =
      indicators?.find((ind) => ind.id === Number(indicatorId)) || null;
    setSelectedIndicator(selected);
    onChange(selected);
  };

  return (
    <div className='flex flex-col gap-2'>
      <div>
        <label
          htmlFor='impactIndicator'
          className='mb-1 block text-sm font-medium'
        >
          Impact Indicator
        </label>
        <select
          id='impactIndicator'
          className='w-full rounded-md border bg-background px-4 py-2'
          value={selectedIndicator?.id || ''}
          onChange={(e) => handleChange(e.target.value)}
        >
          <option value=''>Select an impact indicator</option>
          {indicators?.map((indicator) => (
            <option
              key={indicator.id}
              value={indicator.id}
              disabled={!isSelectable(indicator.indicator_code)}
            >
              {indicator.indicator_code} -{' '}
              {truncateText(indicator.indicator_title)}
            </option>
          ))}
        </select>
      </div>

      {selectedIndicator?.indicator_unit && (
        <div className='flex items-end justify-end'>
          <p className='rounded-md border border-sky-700/50 bg-sky-500/20 px-2 py-1.5 text-sm font-medium'>
            <span className='pr-1 font-medium text-foreground/80'>Unit:</span>{' '}
            {selectedIndicator.indicator_unit}
          </p>
        </div>
      )}
    </div>
  );
}
