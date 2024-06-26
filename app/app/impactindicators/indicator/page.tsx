'use client';

import { useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import Breadcrumbs from '@/_components/breadcrumbs';
import ErrorState from '@/_components/ErrorState';
import { Update } from '@/_lib/types';
import UpdateLarge from '@/_components/UpdateLarge';

export default function Indicator() {
  const supabase = createClient();
  const searchParams = useSearchParams();

  const id = searchParams.get('id');
  const code = searchParams.get('code');

  const [updates, setUpdates] = useState<Update[]>();
  const [error, setError] = useState<string | undefined>();

  const fetchUpdates = async (id: string) => {
    const { data: updates, error } = await supabase
      .from('impact_indicators')
      .select(
        '*, updates(*, projects(*), output_measurables(*, impact_indicators(*)))'
      )
      .eq('id', id)
      .eq('updates.valid', true)
      .eq('updates.original', true);

    if (error) {
      setError(error.message);
      console.log(error);
    }

    if (updates) {
      setUpdates(updates);
      console.log(updates);
    }
  };

  useEffect(() => {
    id && fetchUpdates(id);
  }, [id]);

  return (
    <div className='animate-in pb-24'>
      <div className='mb-8'>
        <Breadcrumbs currentPage={`Impact Indicator ${code}`} />
      </div>

      <div className='mb-4 pl-4'>
        <h2 className='text-xl font-semibold text-white'>
          Relevant Updates for Impact Indicator {code}
        </h2>
      </div>

      <div className='mb-8 bg-card-bg rounded-lg shadow'>
        {error && <ErrorState message={error} />}

        {updates &&
          updates.map((update) => {
            return <UpdateLarge key={update.id} update={update} />;
          })}
      </div>
    </div>
  );
}
