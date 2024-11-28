'use client';

import { ImpactIndicatorSummary } from '@/utils/types';
import { Fragment, useState } from 'react';
import * as d3 from 'd3';

export default function ImpactIndicatorList({
  impactIndicators,
}: {
  impactIndicators: ImpactIndicatorSummary[];
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredIndicators =
    impactIndicators?.filter((impactIndicator) =>
      impactIndicator.indicator_title
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()),
    ) ?? [];

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
        <div className='grid grid-cols-[1fr_5fr_1fr_1fr_2fr] justify-start gap-6 text-sm'>
          <div className='text-right font-semibold'>
            <h3>Indicator Code</h3>
          </div>
          <div className='max-w-prose font-semibold'>
            <h3>Indicator Title</h3>
          </div>
          <div className='text-right font-semibold'>
            <h3>Valid Updates</h3>
          </div>
          <div className='text-right font-semibold'>
            <h3>Total Value</h3>
          </div>
          <div className='font-semibold'>
            <h3>Unit</h3>
          </div>

          {filteredIndicators.map((impactIndicator) => (
            <Fragment key={impactIndicator.impact_indicator_id}>
              <div
                className={`text-right ${impactIndicator.indicator_code.length < 2 && 'text-base font-medium'} ${
                  impactIndicator.indicator_code.length < 4 &&
                  'text-muted-foreground'
                }`}
              >
                {impactIndicator.indicator_code}
              </div>
              <div
                className={`max-w-prose ${impactIndicator.indicator_code.length < 2 && 'text-base font-medium'} ${
                  impactIndicator.indicator_code.length < 4 &&
                  'text-muted-foreground'
                }`}
              >
                {impactIndicator.indicator_title}
              </div>
              {impactIndicator.indicator_code.length > 3 ? (
                <>
                  <div className='text-right'>
                    {impactIndicator.valid_updates}
                  </div>

                  <div className='text-right'>
                    {d3.format(',.0f')(impactIndicator.total_value)}
                  </div>
                  <div className='text-muted-foreground'>
                    {impactIndicator.indicator_unit}
                  </div>
                </>
              ) : (
                <div className='col-span-3' />
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
