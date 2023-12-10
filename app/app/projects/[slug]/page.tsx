import { supabase } from '@/utils/supabase/servicerole';
import { createClient } from '@/_utils/supabase/server';
import { Params } from '@/lib/types';

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

export default async function Project({ params }: { params: Params }) {
  const supabase = createClient();
  const { data: projects, error: projectError } = await supabase
    .from('projects')
    .select('*, users (*)')
    .eq('name', params.slug);

  if (projectError) {
    throw new Error(`Failed to fetch projects: ${projectError.message}`);
  }

  const project = projects[0];
  const pm = project.users;
  const things = ['Thing 2', 'Thing 3', 'Thing 4'];

  let { data: completeness, error } = await supabase.rpc(
    'get_output_measurable_completeness',
    { input_project_id: 35 }
  );
  if (error) {
    console.log(error);
  }
  if (completeness) {
    console.log(completeness[0].output_measurables);
  }

  return (
    <div className='animate-in'>
      <div className='grid grid-cols-2 gap-8'>
        <div className='min-h-[250px] p-8 text-slate-400 bg-card-bg rounded-md shadow'>
          <div className='flex gap-4 mb-4'>
            <p className='w-[130px]'>Operator:</p>
            <p className='text-white'>{project.operator}</p>
          </div>
          <div className='flex gap-4 mb-4'>
            <p className='w-[130px]'>Start date:</p>
            <p className='text-white'>{project.start_date}</p>
          </div>
          <div className='flex gap-4 mb-4'>
            <p className='w-[130px]'>Project Manager:</p>
            <p className='text-white'>{`${pm.first_name} ${pm.last_name}`}</p>
          </div>
        </div>
        {completeness && (
          <div className='p-8 text-lg text-slate-400 bg-card-bg rounded-md shadow'>
            {completeness[0].output_measurables.map((c) => {
              return (
                <div
                  key={c.code}
                  className='flex justify-between items-center gap-1 mb-2 text-sm'
                >
                  <p className='basis-1/6'>{c.code}</p>
                  <div className='w-full rounded-lg bg-gray-900'>
                    <div
                      style={{ width: `${c.percentage_completion}%` }}
                      className='p-1 rounded-lg bg-green-400'
                    ></div>
                  </div>
                  <p className='basis-1/6 text-right'>
                    {c.percentage_completion}%
                  </p>
                </div>
              );
            })}
          </div>
        )}
        {things.map((thing) => {
          return (
            <div
              key={thing}
              className='min-h-[250px] flex justify-center items-center text-lg text-slate-400 bg-card-bg rounded-md shadow'
            >
              <p>{thing}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
