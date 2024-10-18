import { supabase } from '@/utils/supabase/service-role';
import { createClient } from '@/utils/supabase/server';
import PageHeading from '@/components/ui/page-heading';
import ProjectQueryProvider from '@/components/project-page/project-query-provider';

export async function generateStaticParams() {
  const { data: projects, error } = await supabase.from('projects').select('*');

  if (error) {
    throw new Error(`Failed to fetch projects: ${error.message}`);
  }

  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: {
    slug: string;
  };
}) {
  return {
    title: `${params.slug.slice(0, 3).toUpperCase()} | Maerl`,
  };
}

export default async function Project({
  params,
}: {
  params: {
    slug: string;
  };
}) {
  const supabaseClient = createClient();
  const { data: project, error: projectError } = await supabaseClient
    .from('projects')
    .select('*, users (*)')
    .eq('slug', params.slug)
    .single();

  if (projectError) {
    console.log(`Failed to fetch projects: ${projectError.message}`);

    return (
      <div className='animate-in'>
        <div className='mb-8'>
          <PageHeading>Error loading project</PageHeading>
        </div>

        <div className='flex flex-col items-center gap-4 rounded-lg bg-card p-20'>
          <h2 className='font-semibold'>
            Error loading project:{' '}
            <span className='font-mono text-muted-foreground'>
              {params.slug}
            </span>
          </h2>
          <p>
            Please screenshot this whole page (including the address bar) and
            forward it to the SII team:
          </p>
          <p className='rounded-md bg-slate-600 px-2 py-1 text-xs'>
            <code>{projectError.message}</code>
          </p>
        </div>
      </div>
    );
  }

  const pm = `${project.users.first_name} ${project.users.last_name}` || '';

  const flatProject = { ...project, pm };

  return (
    <div className='flex flex-col gap-8 animate-in'>
      <PageHeading>{project.name}</PageHeading>

      <ProjectQueryProvider project={flatProject} />
    </div>
  );
}
