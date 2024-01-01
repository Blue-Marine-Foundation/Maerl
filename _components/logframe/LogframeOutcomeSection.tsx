import { createClient } from '@/_utils/supabase/server';

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

  console.log(outcomes);

  return (
    <div id='outcome' className='scroll-m-8'>
      <h3 className='text-xl font-medium text-foreground/80 mb-4'>Outcome</h3>
      {error && <p>Error fetching impact from database: {error.message}</p>}
      {outcomes &&
        outcomes.map((outcome) => {
          return (
            <p className='text-2xl max-w-2xl text-white font-medium'>
              {outcome.description}
            </p>
          );
        })}
    </div>
  );
}
