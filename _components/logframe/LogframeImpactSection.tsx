import { createClient } from '@/_utils/supabase/server';

export default async function LogframeImpactSection({
  project_slug,
}: {
  project_slug: string;
}) {
  const supabase = createClient();

  const { data: impact, error } = await supabase
    .from('impacts')
    .select(`*, projects!inner(*)`)
    .eq('projects.slug', project_slug)
    .single();

  console.log(impact);

  return (
    <div id='impact' className='scroll-m-8'>
      <h3 className='text-xl font-medium text-foreground/80 mb-4'>Impact</h3>
      {error && <p>Error fetching impact from database: {error.message}</p>}
      {impact && (
        <p className='text-3xl max-w-2xl text-white font-semibold'>
          {impact.title}
        </p>
      )}
    </div>
  );
}
