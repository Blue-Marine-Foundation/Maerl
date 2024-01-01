import { createClient } from '@/_utils/supabase/server';
import { Measurable } from '@/_lib/types';
import Link from 'next/link';

export default async function LogframeOutcomeSection({
  project_slug,
}: {
  project_slug: string;
}) {
  const supabase = createClient();

  const { data: outcomes, error } = await supabase
    .from('outcomes')
    .select(`*, projects!inner(*), outcome_measurables(*)`)
    .eq('projects.slug', project_slug);

  return (
    <div id='outcome' className='scroll-m-8'>
      <h3 className='text-xl font-medium text-foreground/80 mb-4'>Outcome</h3>
      {error && <p>Error fetching impact from database: {error.message}</p>}
      {outcomes &&
        outcomes.map((outcome) => {
          return (
            <div key={outcome.id}>
              <p className='text-2xl max-w-2xl text-white font-medium mb-4'>
                {outcome.description}
              </p>
              <ul className='shadow-md max-w-4xl'>
                {outcome.outcome_measurables.map((om: Measurable) => {
                  return (
                    <li
                      key={om.id}
                      className='border-b first-of-type:rounded-t-lg last-of-type:border-b-transparent last-of-type:rounded-b-lg overflow-hidden'
                    >
                      <Link
                        href={`/app/projects/${project_slug}/logframe/outcome?id=${om.id}&code=${om.code}`}
                        className='flex justify-between items-baseline gap-8 p-6 bg-card-bg'
                      >
                        <h4 className='basis-1/5 shrink-0 font-semibold mb-2 text-white'>
                          Outcome {om.code}
                        </h4>
                        <div className='grow'>
                          <p className='mb-4 text-foreground/80'>
                            {om.description}
                          </p>
                          <h4 className='font-medium mb-2 text-white'>
                            Verified by
                          </h4>
                          <p className='text-foreground/80'>
                            {om.verification}
                          </p>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
    </div>
  );
}
