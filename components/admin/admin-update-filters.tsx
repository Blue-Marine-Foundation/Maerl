'use client';

import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { ChevronUp } from 'lucide-react';

interface FilterType {
  label: string;
  options: string[];
}

interface AdminUpdateFiltersProps {
  filterTypes: FilterType[];
  selected: Record<string, Set<string>>;
  setSelected: React.Dispatch<
    React.SetStateAction<Record<string, Set<string>>>
  >;
}

export default function AdminUpdateFilters({
  filterTypes,
  selected,
  setSelected,
}: AdminUpdateFiltersProps) {
  const [showFilters, setShowFilters] = React.useState(false);

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
    <div className='flex items-start justify-end'>
      {filterTypes.map((filter) => (
        <div
          key={filter.label}
          className='w-60 space-y-4 border-r px-4 py-2 text-sm'
        >
          <div className='flex items-center justify-between'>
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
            <Button
              variant='ghost'
              size='sm'
              type='button'
              onClick={() => setShowFilters((v) => !v)}
            >
              {showFilters ? <ChevronUp /> : <ChevronDown />}
            </Button>
          </div>

          {showFilters && (
            <div className='flex h-48 flex-col gap-2 overflow-y-scroll'>
              {filter.options.map((option) => (
                <div key={option} className='flex items-center gap-3'>
                  <Checkbox
                    id={option}
                    checked={selected[filter.label]?.has(option) || false}
                    onCheckedChange={handleChange(filter.label, option)}
                  />
                  <Label
                    htmlFor={option}
                    className='line-clamp-1 overflow-ellipsis font-normal leading-normal'
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
