'use client';

import * as d3 from 'd3';
import Link from 'next/link';

const IndicatorRow = ({ indicator }: any) => {
  return (
    <div
      key={indicator.id}
      className={`px-4 py-2 ${
        indicator.ii_heirarchy == 'Indicator'
          ? 'bg-card-bg font-normal'
          : 'bg-background font-semibold'
      } flex justify-between last:border-b-0 items-center gap-8`}
    >
      <div className='w-[80px] shrink-0'>
        <p>{indicator.indicator_code}</p>
      </div>
      <div className='grow'>
        <p>{indicator.indicator_title}</p>
      </div>
      <div className='w-[120px] shrink-0 text-right'>
        <p className='text-base font-semibold'>
          {indicator.ii_heirarchy == 'Indicator' && indicator.countUpdates}
        </p>
      </div>
      <div className='w-[100px] shrink-0 text-right'>
        <p className='text-base font-semibold'>
          {indicator.ii_heirarchy == 'Indicator' &&
            d3.format(',.0f')(indicator.impact)}
        </p>
      </div>
      <div className='w-[200px] shrink-0'>
        <p className='text-xs'>
          {indicator.ii_heirarchy == 'Indicator' && indicator.indicator_unit}
        </p>
      </div>
    </div>
  );
};

export default function IndicatorList({ data }: { data: any[] }) {
  return (
    <div className='w-full rounded-lg text-sm'>
      <div>
        <div className='sticky top-0 mb-1 px-4 py-2 bg-card-bg border-b-2 rounded-t-md flex justify-between gap-8 text-base font-semibold'>
          <div className='w-[80px] shrink-0'>
            <h4>Code</h4>
          </div>
          <div className='grow'>
            <h4>Description</h4>
          </div>
          <div className='w-[120px] shrink-0 text-right'>
            <h4>Count Updates</h4>
          </div>
          <div className='w-[100px] shrink-0 text-right'>
            <h4>Impact</h4>
          </div>
          <div className='w-[200px] shrink-0'>
            <h4>Unit</h4>
          </div>
        </div>

        {data &&
          data.map((indicator) => {
            if (indicator.ii_heirarchy != 'Indicator') {
              return <IndicatorRow key={indicator.id} indicator={indicator} />;
            }

            return (
              <Link
                key={indicator.id}
                href={`/app/impactindicators/indicator?id=${indicator.id}&code=${indicator.indicator_code}`}
              >
                <IndicatorRow key={indicator.id} indicator={indicator} />
              </Link>
            );
          })}
      </div>
    </div>
  );
}
