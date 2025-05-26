'use client';

import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { useState } from 'react';
import { Button } from '../ui/button';

export default function AdminUpdateFilters() {
  const filterTypes = [
    {
      label: 'Project',
      options: [
        'Jersey',
        'Berwickshire',
        'Zereshire',
        'Solent',
        'Dogger Bank',
        'SE Iceland',
        'Faroes',
        'Finisterre',
        'Fastnet',
        'Rockall',
      ],
    },
    {
      label: 'Impact Indicator',
      options: ['1.1.1', '1.1.2', '1.1.3'],
    },
    {
      label: 'Update Type',
      options: ['Progress', 'Impact'],
    },
    {
      label: 'Metadata',
      options: ['Has link', 'Verified', 'Duplicate', 'Valid', 'Admin Reviewed'],
    },
  ];

  // State: { [filterLabel]: Set of selected options }
  const [selected, setSelected] = useState(() => {
    const initial: Record<string, Set<string>> = {};
    filterTypes.forEach((f) => {
      initial[f.label] = new Set();
    });
    return initial;
  });

  const [showFilters, setShowFilters] = useState(true);

  const handleChange =
    (filterLabel: string, option: string) => (checked: boolean) => {
      setSelected((prev) => {
        const next = { ...prev };
        next[filterLabel] = new Set(prev[filterLabel]);
        if (checked) {
          next[filterLabel].add(option);
        } else {
          next[filterLabel].delete(option);
        }
        return next;
      });
    };

  return (
    <div className='flex items-start justify-between rounded-md border bg-card p-2'>
      <Button
        variant='ghost'
        size='sm'
        type='button'
        onClick={() => setShowFilters((v) => !v)}
      >
        {showFilters ? 'Hide filters' : 'Show filters'}
      </Button>
      <div className='flex items-start justify-end'>
        {filterTypes.map((filter) => (
          <div key={filter.label} className='w-64 space-y-4 px-4 py-2 text-sm'>
            <h3 className='flex items-baseline gap-2 font-medium'>
              {filter.label}{' '}
              <span className='font-mono text-xs'>
                (
                {selected[filter.label]?.size !== 0
                  ? `${selected[filter.label]?.size}`
                  : 'All'}
                )
              </span>
              {selected[filter.label]?.size !== 0 && (
                <Button
                  variant='ghost'
                  size='sm'
                  type='button'
                  onClick={() => {
                    setSelected((prev) => ({
                      ...prev,
                      [filter.label]: new Set(),
                    }));
                  }}
                  className='ml-1 h-auto px-2 py-0.5 text-xs hover:underline'
                >
                  Reset
                </Button>
              )}
            </h3>
            {showFilters && (
              <div className='flex h-48 flex-col gap-2 overflow-y-scroll'>
                {filter.options.map((option) => (
                  <div key={option} className='flex items-center gap-3'>
                    <Checkbox
                      id={option}
                      checked={selected[filter.label]?.has(option) || false}
                      onCheckedChange={handleChange(filter.label, option)}
                    />
                    <Label htmlFor={option} className='font-normal'>
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
