import { supabase } from '@/utils/supabase/service-role';
import { createClient } from '@/utils/supabase/server';
import PageHeading from '@/components/ui/page-heading';
import { PlusCircleIcon } from 'lucide-react';
import ProjectMetadataDisplay from '@/components/project-metadata/project-metadata-display';
import MetadataQueryProvider from '@/components/project-metadata/metadata-query-provider';

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

  const pm = project.users
    ? [project.users.first_name, project.users.last_name]
        .filter(Boolean)
        .join(' ')
    : '';

  const flatProject = { ...project, pm };

  return (
    <div className='flex flex-col gap-8 animate-in'>
      <PageHeading>{project.name}</PageHeading>

      <div className='grid grid-cols-3 items-start gap-4'>
        <MetadataQueryProvider>
          <ProjectMetadataDisplay project={flatProject} />
        </MetadataQueryProvider>
        <div className='flex min-h-64 flex-col rounded-md bg-card p-4'>
          <h3 className='mb-auto text-sm font-semibold text-muted-foreground'>
            Logframe
          </h3>
          <div className='flex flex-grow flex-col items-center justify-center gap-2'>
            <p className='text-foreground/80'>
              This project has no logframe yet
            </p>
            <button className='mt-2 flex items-center gap-2 rounded-md border border-dashed px-3 py-1.5 text-sm text-foreground/80 transition-all hover:border-solid hover:border-foreground/50 hover:text-foreground'>
              <PlusCircleIcon className='h-4 w-4' /> Create logframe
            </button>
          </div>
        </div>
        <div className='flex min-h-64 flex-col rounded-md bg-card p-4'>
          <h3 className='mb-auto text-sm font-semibold text-muted-foreground'>
            Funding requests
          </h3>
          <div className='flex flex-grow flex-col items-center justify-center gap-2'>
            <p className='text-foreground/80'>
              This project has no funding requests yet
            </p>
            <button className='mt-2 flex items-center gap-2 rounded-md border border-dashed px-3 py-1.5 text-sm text-foreground/80 transition-all hover:border-solid hover:border-foreground/50 hover:text-foreground'>
              <PlusCircleIcon className='h-4 w-4' /> Create funding request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
