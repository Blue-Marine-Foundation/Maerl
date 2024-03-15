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
    <div className='animate-in flex justify-between gap-8'>
      <div className='basis-1/5'>
        {project && <ProjectOverview project={project} pm={pm} />}
      </div>
      <div className='basis-4/5'>
        {project.outputs && <ProjectOutputs project={project} />}
      </div>
    </div>
  );
}
