'use client';

import { Update } from '@/_lib/types';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import ErrorState from './ErrorState';
import { PostgrestError } from '@supabase/supabase-js';
import UpdateLarge from './UpdateLarge';
import Link from 'next/link';

export default function OutputUpdatesWrapper({ output }: { output: number }) {
  const supabase = createClient();

  const [updates, setUpdates] = useState<Update[]>([]);
  const [error, setError] = useState<PostgrestError | null>(null);

  const fetchUpdates = async (output: number) => {
    const { data: updates, error } = await supabase
      .from('updates')
      .select(
        '*, projects (*), output_measurables!inner(*, outputs!inner(*), impact_indicators (*))'
      )
      .eq('output_measurables.outputs.id', output)
      .eq('duplicate', false);

    if (error) {
      console.log(error);
      setUpdates([]);
      setError(error);
    }

    if (updates) {
      setError(null);
      setUpdates(updates);
    }
  };

  useEffect(() => {
    output && fetchUpdates(output);
  }, [output]);

  if (error) {
    console.log(error);

    return <ErrorState message={error.message} />;
  }

  return (
    <div>
      <h2 className='mb-4 px-4 text-xl font-medium'>Relevant Updates</h2>
      {updates && updates.length > 0 ? (
        updates.map((update) => {
          return <UpdateLarge key={update.id} update={update} />;
        })
      ) : (
        <div className='p-8 flex flex-col items-center gap-4 bg-card-bg rounded-md'>
          <p>No updates found</p>
          <Link className='underline' href='/app/newupdate'>
            Add the first update
          </Link>
        </div>
      )}
    </div>
  );
}
