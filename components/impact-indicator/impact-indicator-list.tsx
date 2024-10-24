'use client';

import { ImpactIndicator } from '@/utils/types';
import { useState } from 'react';

export default function ImpactIndicatorList({
  impactIndicators,
}: {
  impactIndicators: ImpactIndicator[];
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredIndicators = impactIndicators.filter((impactIndicator) =>
    impactIndicator.indicator_title
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex items-center gap-4'>
        <label htmlFor='search' className='sr-only text-sm text-foreground'>
          Filter impact indicators:
        </label>
        <input
          id='search'
          name='search'
          type='text'
          placeholder='Search...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='w-80 rounded-md border bg-background px-2 py-1'
        />
      </div>

      <div className='flex flex-col gap-2'>
        {filteredIndicators.map((impactIndicator) => (
          <div
            className='grid grid-cols-[1fr_7fr] justify-start gap-6'
            key={impactIndicator.id}
          >
            <div className='flex items-center gap-4 font-medium'>
              <span className='text-muted-foreground'>
                {impactIndicator.indicator_code}
              </span>
              <hr className='grow' />
            </div>
            <div className='text-sm text-muted-foreground'>
              {impactIndicator.indicator_title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
