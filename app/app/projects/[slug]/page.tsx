import dayjs from 'dayjs';
import { supabase } from '@/utils/supabase/servicerole';
import { createClient } from '@/_utils/supabase/server';
import Update from '@/_components/Update';
import { Params, Measurable } from '@/lib/types';

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
    .select('*, users (*), output_measurables (*)')
    .eq('name', params.slug);

  if (projectError) {
    throw new Error(`Failed to fetch projects: ${projectError.message}`);
  }

  const project = projects[0];
  const projectID = project.id;
  const pm = project.users || '';

  const { data: updates } = await supabase
    .from('updates')
    .select('*, projects (*), output_measurables (*, impact_indicators (*))')
    .order('date', { ascending: false })
    .eq('project_id', projectID)
    .limit(15);

  const relativeTime = require('dayjs/plugin/relativeTime');
  dayjs.extend(relativeTime);

  return (
    <div className='animate-in'>
      <div className='flex justify-between gap-8 py-1.5'>
        <div className='basis-6/12'>
          <p className='mb-4'>Project Overview</p>
          <div className='mb-8 p-6 text-sm text-slate-400 bg-card-bg rounded-md shadow'>
            <div className='flex gap-4 mb-6'>
              <p className='w-[130px]'>Lead Partner:</p>
              <p className='text-white'>{project.lead_partner}</p>
            </div>
            <div className='flex gap-4 mb-6'>
              <p className='w-[130px]'>Start date:</p>
              <p className='text-white'>{project.start_date}</p>
            </div>
            <div className='flex gap-4 mb-6'>
              <p className='w-[130px]'>Project Manager:</p>
              <p className='text-white'>{`${pm.first_name} ${pm.last_name}`}</p>
            </div>
            {project.delivery_partners && (
              <div className='flex gap-4 mb-6'>
                <p className='w-[130px]'>Delivery Partners:</p>
                <ul className='text-white'>
                  {project.delivery_partners.map(
                    (partner: { name: String }) => (
                      <li className='mb-2 last:mb-0'>{partner.name}</li>
                    )
                  )}
                </ul>
              </div>
            )}
            {project.funding_partners && (
              <div className='flex gap-4 mb-6'>
                <p className='w-[130px]'>Funding Partners:</p>
                <ul className='text-white'>
                  {project.funding_partners.map((partner: { name: String }) => (
                    <li className='mb-2 last:mb-0'>{partner.name}</li>
                  ))}
                </ul>
              </div>
            )}
            {project.funders && (
              <div className='flex gap-4 mb-6'>
                <p className='w-[130px]'>Funders:</p>
                <ul className='text-white'>
                  {project.funders.map((funder: { name: String }) => (
                    <li className='mb-2 last:mb-0'>{funder.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <p className='mb-4'>Recent Updates</p>
          {updates &&
            updates.map((update) => {
              return <Update key={update.id} size='small' update={update} />;
            })}
        </div>

        <div className='basis-6/12'>
          {project.output_measurables && (
            <>
              <p className='mb-4'>Output Progress</p>
              <div className='self-start p-6 text-slate-400 bg-card-bg rounded-md shadow'>
                {project.output_measurables
                  .sort((a: Measurable, b: Measurable) =>
                    a.code.localeCompare(b.code)
                  )
                  .map((c: Measurable) => {
                    return (
                      <div
                        key={c.code}
                        className='flex justify-between items-center gap-1 text-sm mb-4 last:mb-0'
                      >
                        <p className='basis-1/6 text-foreground'>{c.code}</p>
                        <div className='w-full rounded-lg bg-gray-900'>
                          <div
                            style={{ width: `${c.percentage_complete}%` }}
                            className='p-1 rounded-lg bg-green-400'
                          ></div>
                        </div>
                        <p className='basis-1/6 text-right'>
                          {c.percentage_complete}%
                        </p>
                      </div>
                    );
                  })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
