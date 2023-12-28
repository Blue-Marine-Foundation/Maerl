import { supabase } from '@/utils/supabase/servicerole';
import { createClient } from '@/_utils/supabase/server';
import UpdateSmall from '@/_components/UpdateSmall';
import { Params, Measurable } from '@/lib/types';
import ProjectOverview from '@/_components/projecthome/ProjectOverview';
import ProjectProgess from '@/_components/projecthome/ProjectProgress';

export async function generateStaticParams() {
  const { data: projects, error } = await supabase.from('projects').select('*');

  if (error) {
    throw new Error(`Failed to fetch projects: ${error.message}`);
  }

  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: { params: Params }) {
  return {
    title: `${params.slug} | Maerl`,
  };
}

export default async function Project({ params }: { params: Params }) {
  const supabase = createClient();
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('*, users (*), output_measurables (*)')
    .eq('slug', params.slug)
    .single();

  if (projectError) {
    throw new Error(`Failed to fetch projects: ${projectError.message}`);
  }

  const projectID = project.id;
  const pm = project.users || '';

  const { data: updates } = await supabase
    .from('updates')
    .select('*, projects (*), output_measurables (*, impact_indicators (*))')
    .order('date', { ascending: false })
    .eq('project_id', projectID)
    .limit(10);

  return (
    <div className='animate-in flex justify-between gap-8 '>
      <div className='basis-1/4 flex flex-col gap-8'>
        {project && <ProjectOverview project={project} pm={pm} />}
      </div>
      <div className='basis-3/4 flex justify-between gap-8'>
        <div className='basis-1/2'>
          <p className='mb-4 font-medium'>Recent Updates</p>
          {updates &&
            updates.map((update) => {
              return <UpdateSmall key={update.id} update={update} />;
            })}
        </div>

        <div className='basis-1/2'>
          {project.output_measurables && <ProjectProgess project={project} />}
        </div>
      </div>
    </div>
  );
}
