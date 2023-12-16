import { createClient } from '@/_utils/supabase/server';
import { Params, Output, Measurable } from '@/lib/types';

export default async function Outputs({ params }: { params: Params }) {
  const supabaseClient = createClient();
  const { data: projects, error } = await supabaseClient
    .from('projects')
    .select(
      `*,impacts (*),outcomes (*),outcome_measurables (*), outputs (*, output_measurables (*)), updates (*)`
    )
    .eq('slug', params.slug)
    .limit(1);

  if (!projects) {
    return <p>Error fetching logframe</p>;
  }

  const project = projects[0];

  return (
    <div className='animate-in'>
      {project.outputs.map((output: Output) => (
        <div key={output.code} className='mb-16'>
          <h4 className='text-lg mb-2 font-mono font-bold'>{output.code}</h4>
          <p className='text-xl max-w-2xl mb-8'>{output.description}</p>
          {output.output_measurables?.map((om) => {
            return (
              <div key={om.id} className='p-8 mb-8 rounded-md bg-card-bg'>
                <div className='flex gap-4 mb-8 text-sm font-mono'>
                  <p className='px-2 py-1 rounded bg-pink-300 text-card-bg'>
                    {om.code}
                  </p>
                  <p className='px-2 py-1 rounded bg-purple-300 text-card-bg'>
                    {om.value} {om.unit}
                  </p>
                </div>
                <h4 className='text-lg mb-8'>{om.description}</h4>
                <div className='flex gap-4 mb-4 text-sm'>
                  <div className='basis-1/5'>
                    <p className='text-foreground/80'>Verified by</p>
                  </div>
                  <div className='basis-4/5'>
                    <p>{om.verification}</p>
                  </div>
                </div>
                <div className='flex gap-4 text-sm'>
                  <div className='basis-1/5'>
                    <p className='text-foreground/80'>Assumption</p>
                  </div>
                  <div className='basis-4/5'>
                    <p>{om.assumptions}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
