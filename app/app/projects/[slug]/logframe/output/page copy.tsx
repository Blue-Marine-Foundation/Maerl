'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/_utils/supabase/client';
import Link from 'next/link';
import Breadcrumbs from '@/_components/breadcrumbs';
import { useParams, useSearchParams } from 'next/navigation';
import UpdateMediumNested from '@/_components/UpdateMediumNested';

function extractAllUpdates(data) {
  let updates = [];

  if (!data.outputs || !Array.isArray(data.outputs)) return updates;

  data.outputs.forEach((output) => {
    if (!output.output_measurables || !Array.isArray(output.output_measurables))
      return;

    output.output_measurables.forEach((measurable) => {
      if (!measurable.updates || !Array.isArray(measurable.updates)) return;

      updates = updates.concat(measurable.updates);
    });
  });

  return updates;
}

export default function Outcome() {
  const [outcomeData, setOutcomeData] = useState(null);
  const [updates, setUpdates] = useState([]);

  const projectSlug = useParams<{ slug: string }>();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const code = searchParams.get('code');
  const supabase = createClient();

  useEffect(() => {
    const fetchOutcome = async () => {
      const { data, error } = await supabase
        .from('outcome_measurables')
        .select('*, projects(*), outputs(*, output_measurables(*, updates(*)))')
        .eq('id', id)
        .single();

      if (!error) {
        console.log(data);
        setOutcomeData(data);
        setUpdates(extractAllUpdates(data));
      } else {
        console.error(error);
      }
    };

    if (id) fetchOutcome();
  }, [id]);

  return (
    <div className='animate-in pb-24'>
      <div className='mb-8'>
        <Breadcrumbs />
      </div>

      <div className='p-8 mb-8 bg-card-bg rounded-lg shadow'>
        <h2 className='mb-4 text-2xl font-semibold text-white'>
          {outcomeData && <span>{outcomeData.projects.name} </span>}Outcome{' '}
          {code}
        </h2>

        {outcomeData && (
          <div>
            <p className='mb-4 max-w-3xl text-lg'>{outcomeData.description}</p>
            {outcomeData.verification && (
              <div className='mb-4'>
                <h3 className='mb-2 text-foreground/80'>Verified by</h3>
                <p>{outcomeData.verification}</p>
              </div>
            )}
          </div>
        )}
      </div>
      <div className='flex justify-between gap-8'>
        <div className='basis-1/3'>
          <h3 className='text-lg font-medium mb-4'>Related Outputs</h3>
          {outcomeData &&
            outcomeData.outputs.map((output) => {
              return (
                <Link
                  href={`/app/projects/${projectSlug.slug}/logframe/output?id=${output.id}&code=${output.code}`}
                  key={output.code}
                  className='p-4 flex justify-between items-center group first-of-type:pt-5 last-of-type:pb-5 first-of-type:rounded-t-lg last-of-type:rounded-b-lg bg-card-bg hover:bg-card-bg/60 text-slate-100 border border-transparent border-b-foreground/20 last-of-type:border-b-transparent transition-all duration-300'
                >
                  <p className='grow'>Output {output.code}</p>
                  <p className='w-12 text-right transition-all duration-300 pr-4 group-hover:pr-1'>
                    &rarr;
                  </p>
                </Link>
              );
            })}
        </div>
        <div className='basis-2/3 shrink-0'>
          <h3 className='text-lg font-medium mb-4'>Related Updates</h3>
          {updates &&
            updates.map((update) => {
              return <UpdateMediumNested key={update.id} update={update} />;
            })}
        </div>
      </div>
    </div>
  );
}
