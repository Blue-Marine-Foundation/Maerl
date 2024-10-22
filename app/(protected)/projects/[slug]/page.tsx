import { createClient } from '@/utils/supabase/server';
import { PlusCircleIcon } from 'lucide-react';
import ProjectMetadataDisplay from '@/components/project-metadata/project-metadata-display';
import MetadataQueryProvider from '@/components/project-metadata/metadata-query-provider';

export default async function ProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const supabaseClient = createClient();
  const { data: project, error: projectError } = await supabaseClient
    .from('projects')
    .select('*, users (*)')
    .eq('slug', params.slug)
    .single();

  if (projectError) {
    return <div>Error loading project: {projectError.message}</div>;
  }

  const pm = project.users
    ? [project.users.first_name, project.users.last_name]
        .filter(Boolean)
        .join(' ')
    : '';

  const flatProject = { ...project, pm };

  return (
    <div className='grid grid-cols-3 items-start gap-4'>
      <MetadataQueryProvider>
        <ProjectMetadataDisplay project={flatProject} />
      </MetadataQueryProvider>
      <div className='flex min-h-64 flex-col rounded-md bg-card p-4'>
        <h3 className='mb-auto text-sm font-semibold text-muted-foreground'>
          Logframe
        </h3>
        <div className='flex flex-grow flex-col items-center justify-center gap-2'>
          <p className='text-foreground/80'>This project has no logframe yet</p>
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
  );
}
