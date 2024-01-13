'use client';

import { useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import Breadcrumbs from '@/_components/breadcrumbs';
import Update from '@/_components/UpdateMedium';
import { Measurable } from '@/_lib/types';

export default function Output() {
  const supabase = createClient();
  const searchParams = useSearchParams();

  const id = searchParams.get('id');
  const code = searchParams.get('code');

  const [project, setProject] = useState('');
  const [output, setOutput] = useState<Measurable>();
  const [updates, setUpdates] = useState<any[]>([]);

  const fetchOutput = async (id: string) => {
    const { data: updates, error } = await supabase
      .from('updates')
      .select(
        '*, projects!inner(*), output_measurables!inner(*, impact_indicators (*))'
      )
      .order('date', { ascending: false })
      .eq('output_measurables.id', id);

    if (updates) {
      setProject(updates[0].projects.name);
      setOutput(updates[0].output_measurables);
      setUpdates(updates);
    }

    if (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    id && fetchOutput(id);
  }, []);

  return (
    <div className='animate-in pb-24'>
      <div className='mb-8'>
        <Breadcrumbs />
      </div>

      <div className='p-8 mb-8 bg-card-bg rounded-lg shadow'>
        <h2 className='mb-4 text-2xl font-semibold text-white'>
          {project && <span>{project} </span>}Output {code}
        </h2>

        {output && (
          <div>
            <p className='mb-4 max-w-3xl text-lg'>{output.description}</p>
            {output.verification && (
              <div className='mb-4'>
                <h3 className='mb-2 text-foreground/80'>Verified by</h3>
                <p>{output.verification}</p>
              </div>
            )}
            {output.assumptions && (
              <div>
                <h3 className='mb-2 text-foreground/80'>Assumptions</h3>
                <p>{output.assumptions}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div>
        <h2 className='mb-8 text-lg font-medium'>Relevant Updates</h2>
        {updates.map((update) => {
          return <Update key={update.id} update={update} />;
        })}
      </div>
    </div>
  );
}
