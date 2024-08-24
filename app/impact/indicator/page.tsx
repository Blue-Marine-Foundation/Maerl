'use client';

import { useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import Breadcrumbs from '@/_components/breadcrumbs';
import ErrorState from '@/_components/ErrorState';
import { ImpactIndicator, Update } from '@/_lib/types';
import UpdateLarge from '@/_components/UpdateLarge';
import * as d3 from 'd3';

export default function Indicator() {
  const supabase = createClient();
  const searchParams = useSearchParams();

  const id = searchParams.get('id');
  const code = searchParams.get('code');

  const [indicator, setIndicator] = useState<ImpactIndicator>();
  const [impact, setImpact] = useState<number>();
  const [updates, setUpdates] = useState<Update[]>();

  const fetchUpdates = async (id: string) => {
    const { data, error } = await supabase
      .from('impact_indicators')
      .select(
        '*, updates(*, projects(*), impact_indicators (*), output_measurables(*, impact_indicators(*)))'
      )
      .eq('id', id)
      .eq('updates.valid', true)
      .eq('updates.duplicate', false)
      .single();

    if (error) {
      console.log(error);
      return <ErrorState message={error.message} />;
    }

    if (data) {
      console.log(data.updates);
      setIndicator(data);

      setImpact(
        data.updates.reduce((acc: number, i: any) => {
          return acc + i.value;
        }, 0)
      );

      setUpdates(data.updates);
    }
  };

  useEffect(() => {
    id && fetchUpdates(id);
  }, [id]);

  return (
    <div className='animate-in pt-4 pb-24'>
      <div className='mb-6'>
        <Breadcrumbs currentPage={`Impact Indicator ${code}`} />
      </div>

      <div className='mb-8 px-4 py-6 bg-card-bg rounded-lg shadow-md'>
        <div className='mb-8 flex flex-col gap-4'>
          <h3 className='text-sm font-medium text-foreground/80'>
            Impact Indicator {code}
          </h3>

          {indicator && (
            <h2 className='text-2xl font-semibold text-white'>
              {indicator.indicator_title}
            </h2>
          )}
          {impact && (
            <p>
              Total of {d3.format(',.0f')(impact)}{' '}
              {indicator ? indicator.indicator_unit : null}
            </p>
          )}
        </div>

        <div className='border rounded-md'>
          {updates &&
            updates.map((update) => {
              return <UpdateLarge key={update.id} update={update} />;
            })}
        </div>
      </div>
    </div>
  );
}
