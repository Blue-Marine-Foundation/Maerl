import { supabase } from '@/utils/supabase/servicerole';
import { createClient } from '@/_utils/supabase/server';
import { Params } from '@/lib/types';
import ProjectOverview from '@/_components/projecthome/ProjectOverview';
import ProjectOutputs from '@/_components/projecthome/ProjectOutputs';
import Link from 'next/link';

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
    .select('*, users (*), outputs (*), updates (*)')
    .eq('slug', params.slug)
    .single();

  if (projectError) {
    console.log(`Failed to fetch projects: ${projectError.message}`);

    return (
      <div className='animate-in'>
        <div className='bg-card-bg p-20 flex flex-col items-center gap-4 rounded-lg'>
          <h2 className='font-semibold'>Error loading project</h2>
          <p>Please screenshot the page and forward it to the SII team:</p>
          <p className='px-2 py-1 text-xs bg-slate-600 rounded-md'>
            <code>{projectError.message}</code>
          </p>
        </div>
      </div>
    );
  }

  const pm = project.users || '';

  return (
    <div className='animate-in flex justify-between gap-8'>
      <div className='basis-1/5'>
        {project && <ProjectOverview project={project} pm={pm} />}
      </div>
      <div className='basis-4/5'>
        {project.outputs && project.outputs.length > 0 && (
          <ProjectOutputs project={project} />
        )}
        {project.outputs && project.outputs.length == 0 && (
          <div className='flex flex-col items-stretch gap-4'>
            <div className='mb-4 bg-card-bg p-16 flex flex-col items-center gap-8 rounded-lg'>
              <p>No project outputs uploaded yet</p>
              <p>
                <Link href={`./${project.slug}/updates`} className='underline'>
                  View {project.updates.length} updates
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
