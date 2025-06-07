'use client';

import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { ChevronUp } from 'lucide-react';

export interface FilterType {
  label: string;
  options: string[];
  type: 'checkbox' | 'toggle';
}

interface FilterSectionProps {
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  selectedCount?: number;
  onReset?: () => void;
}

function FilterSection({
  label,
  isOpen,
  onToggle,
  children,
  selectedCount,
  onReset,
}: FilterSectionProps) {
  return (
    <div className='w-60 space-y-4 border-r px-4 py-2 text-sm'>
      <div className='flex items-center justify-between'>
        <h3 className='flex items-baseline gap-2 font-medium'>
          {label}{' '}
          {selectedCount !== undefined && (
            <span className='font-mono text-xs'>
              ({selectedCount !== 0 ? `${selectedCount}` : 'All'})
            </span>
          )}
          {selectedCount !== undefined && selectedCount !== 0 && onReset && (
            <Button
              variant='ghost'
              size='sm'
              type='button'
              onClick={onReset}
              className='ml-1 h-auto px-2 py-0.5 text-xs hover:underline'
            >
              Reset
            </Button>
          )}
        </h3>
        <Button variant='ghost' size='sm' type='button' onClick={onToggle}>
          {isOpen ? <ChevronUp /> : <ChevronDown />}
        </Button>
      </div>

      {isOpen && (
        <div className='flex h-48 flex-col gap-2 overflow-y-scroll'>
          {children}
        </div>
      )}
    </div>
  );
}

interface CheckboxFilterProps {
  options: string[];
  selected: Set<string>;
  onChange: (option: string, checked: boolean) => void;
}

function CheckboxFilter({ options, selected, onChange }: CheckboxFilterProps) {
  return (
    <>
      {options.map((option) => (
        <div key={option} className='flex items-center gap-3'>
          <Checkbox
            id={option}
            checked={selected.has(option)}
            onCheckedChange={(checked) => onChange(option, checked as boolean)}
          />
          <Label
            htmlFor={option}
            className='line-clamp-1 overflow-ellipsis font-normal leading-normal'
          >
            {option}
          </Label>
        </div>
      ))}
    </>
  );
}

interface ToggleFilterProps {
  options: string[];
  values: Record<string, 'yes' | 'no' | 'either'>;
  onChange: (option: string, value: 'yes' | 'no' | 'either') => void;
}

function ToggleFilter({ options, values, onChange }: ToggleFilterProps) {
  return (
    <>
      {options.map((option) => (
        <div key={option} className='flex w-full items-center justify-between'>
          <Label className='line-clamp-1 overflow-ellipsis font-normal leading-normal'>
            {option}
          </Label>
          <ToggleGroup
            type='single'
            value={values[option]}
            onValueChange={(value) => {
              if (!value) return;
              onChange(option, value as 'yes' | 'no' | 'either');
            }}
            className='flex items-center gap-1'
          >
            <ToggleGroupItem value='yes' size='sm' className='h-6 px-2 text-xs'>
              Yes
            </ToggleGroupItem>
            <ToggleGroupItem value='no' size='sm' className='h-6 px-2 text-xs'>
              No
            </ToggleGroupItem>
            <ToggleGroupItem
              value='either'
              size='sm'
              className='h-6 px-2 text-xs'
            >
              Either
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      ))}
    </>
  );
}

interface AdminUpdateFiltersProps {
  filterTypes: FilterType[];
  selected: Record<string, Set<string>>;
  setSelected: React.Dispatch<
    React.SetStateAction<Record<string, Set<string>>>
  >;
  metadataToggles?: Record<string, 'yes' | 'no' | 'either'>;
  setMetadataToggles?: React.Dispatch<
    React.SetStateAction<Record<string, 'yes' | 'no' | 'either'>>
  >;
}

export default function AdminUpdateFilters({
  filterTypes,
  selected,
  setSelected,
  metadataToggles,
  setMetadataToggles,
}: AdminUpdateFiltersProps) {
  const [showFilters, setShowFilters] = React.useState(false);

  const handleCheckboxChange = (
    filterLabel: string,
    option: string,
    checked: boolean,
  ) => {
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

  const handleToggleChange = (
    option: string,
    value: 'yes' | 'no' | 'either',
  ) => {
    if (!setMetadataToggles) return;
    setMetadataToggles((prev) => ({
      ...prev,
      [option]: value,
    }));
  };

  return (
    <div className='flex items-start justify-end'>
      {filterTypes.map((filter) => (
        <FilterSection
          key={filter.label}
          label={filter.label}
          isOpen={showFilters}
          onToggle={() => setShowFilters((v) => !v)}
          selectedCount={
            filter.type === 'checkbox'
              ? selected[filter.label]?.size
              : undefined
          }
          onReset={
            filter.type === 'checkbox'
              ? () => {
                  setSelected((prev) => ({
                    ...prev,
                    [filter.label]: new Set(),
                  }));
                }
              : undefined
          }
        >
          {filter.type === 'checkbox' ? (
            <CheckboxFilter
              options={filter.options}
              selected={selected[filter.label]}
              onChange={(option, checked) =>
                handleCheckboxChange(filter.label, option, checked)
              }
            />
          ) : (
            <ToggleFilter
              options={filter.options}
              values={metadataToggles || {}}
              onChange={handleToggleChange}
            />
          )}
        </FilterSection>
      ))}
    </div>
  );
}
