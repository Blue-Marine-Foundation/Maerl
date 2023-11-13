import { supabase } from '@/utils/supabase/servicerole';
import { createClient } from '@/_utils/supabase/server';
import { notFound } from 'next/navigation';
import { Params, Measurable, Output } from '@/lib/types';

export async function generateStaticParams() {
  const { data: projects, error } = await supabase.from('projects').select('*');

  if (error) {
    throw new Error(`Failed to fetch projects: ${error.message}`);
  }

  return projects.map((project) => ({
    slug: project.name,
  }));
}

export async function generateMetadata({ params }: { params: Params }) {
  return {
    title: `${params.slug} | Maerl`,
  };
}

async function Project({ params }: { params: Params }) {
  const supabaseClient = createClient();
  const { data: projects, error } = await supabaseClient
    .from('projects')
    .select(
      `*,impacts (*),outcomes (*),outcome_measurables (*), outputs (*), output_measurables (*)`
    )
    .eq('name', params.slug)
    .limit(1);

  if (!projects) {
    notFound();
  }

  const project = projects[0];

  return (
    <>
      <div className='max-w-6xl mx-auto'>
        <h2 className='text-2xl font-bold mb-8'>{`${project.name} (${project.id}) `}</h2>

        <div className='mb-8 flex justify-start items-start gap-8'>
          <div className='w-[200px]'>
            <h3 className='text-xl font-medium'>Impact</h3>
          </div>

          <div className='max-w-lg'>
            <p className='text-foreground/90 pt-1'>
              {project.impacts[0] && project.impacts[0].title}
            </p>
          </div>
        </div>
        <div className='mb-8 flex justify-start items-start gap-8'>
          <div className='w-[200px]'>
            <h3 className='text-xl font-medium'>Outcome</h3>
          </div>

          <div className='max-w-4xl'>
            <p className='text-foreground/90 pt-1 max-w-lg mb-6'>
              {project.outcomes[0] && project.outcomes[0].description}
            </p>
            <table className='table-auto text-sm'>
              <thead>
                <tr className='border-t'>
                  <th colSpan={2} className='text-left p-2'>
                    Measured by
                  </th>
                  <th className='text-left p-2 pl-4'>Verified by</th>
                </tr>
              </thead>
              <tbody>
                {project.outcome_measurables.map((measurable: Measurable) => {
                  return (
                    <tr key={measurable.code} className='border-t'>
                      <td className='p-2 align-top'>{measurable.code}</td>
                      <td className='p-2 align-top'>
                        {measurable.description}
                      </td>
                      <td className='p-2 pl-4 align-top'>
                        {measurable.verification}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className='mb-8 flex justify-start items-start gap-8'>
          <div className='w-[200px]'>
            <h3 className='text-xl font-medium'>Outputs</h3>
          </div>

          <div className='max-w-4xl'>
            {project.outputs.map((output: Output) => (
              <div key={output.code}>
                <p className='text-foreground/90 pt-1 max-w-lg text-sm mb-4'>
                  {output.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Project;
