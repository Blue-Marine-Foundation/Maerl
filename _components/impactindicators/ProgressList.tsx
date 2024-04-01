'use client';

import * as d3 from 'd3';

export default function ProgressList({ data }: { data: any[] }) {
  return (
    <div className='w-full rounded-lg text-sm'>
      <div>
        <div className='mb-1 px-4 py-2 bg-card-bg border-b-2 rounded-t-md flex justify-between gap-8 text-base font-semibold'>
          <div className='pl-[112px] grow'>
            <h4>Description</h4>
          </div>
          <div className='w-[120px] shrink-0 text-right'>
            <h4>Count Updates</h4>
          </div>
          <div className='w-[100px] shrink-0 text-right mr-[232px]'>
            <h4>Value</h4>
          </div>
        </div>
      </div>

      {data &&
        data.map((indicator) => {
          return (
            <div
              key={indicator.id}
              className={`px-4 py-2 bg-card-bg flex justify-between last:border-b-0 items-center gap-8`}
            >
              <div className='pl-[112px] grow'>
                <p>{indicator.indicator_code}</p>
              </div>
              <div className='w-[120px] shrink-0 text-right'>
                <p className='text-base font-semibold'>
                  {indicator.countUpdates}
                </p>
              </div>
              <div className='w-[100px] shrink-0 text-right mr-[232px]'>
                <p className='text-base font-semibold'>
                  {d3.format(',.0f')(indicator.impact)}
                </p>
              </div>
            </div>
          );
        })}
    </div>
  );
}
