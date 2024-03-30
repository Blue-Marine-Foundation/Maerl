import { supabase } from '@/utils/supabase/servicerole';
import { createClient } from '@/_utils/supabase/server';
import { Params } from '@/lib/types';
import ProjectOverview from '@/_components/projecthome/ProjectOverview';
import ProjectOutputs from '@/_components/projecthome/ProjectOutputs';

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
    .select('*, users (*), outputs (*)')
    .eq('slug', params.slug)
    .single();

  if (projectError) {
    console.log(`Failed to fetch projects: ${projectError.message}`);
  }

  const pm = project.users || '';

  return (
    <div className='animate-in flex justify-between gap-8'>
      {projectError && (
        <p>Error fetching project data: ${projectError.message}</p>
      )}
      <div className='basis-1/5'>
        {project && <ProjectOverview project={project} pm={pm} />}
      </div>
      <div className='basis-4/5'>
        {project.outputs && project.outputs.length > 0 && (
          <ProjectOutputs project={project} />
        )}
        {project.outputs && project.outputs.length == 0 && (
          <div className='bg-card-bg p-20 flex flex-col items-center rounded-lg'>
            <p>No project data uploaded yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
