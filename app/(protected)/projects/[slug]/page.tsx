import { createClient } from '@/utils/supabase/server';
import { PlusCircleIcon } from 'lucide-react';
import ProjectMetadataDisplay from '@/components/project-metadata/project-metadata-display';
import QueryProvider from '@/utils/query-provider';
import LogframeCard from '@/components/logframe/logframe-card';

export default async function ProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projects')
    .select('*, users (*)')
    .eq('slug', slug)
    .single();

  if (error) {
    return <div>Error loading project: {error.message}</div>;
  }

  const pm = data.users
    ? [data.users.first_name, data.users.last_name].filter(Boolean).join(' ')
    : '';

  const project = { ...data, pm };

  return (
    <QueryProvider>
      <div className='grid grid-cols-3 items-start gap-4'>
        <ProjectMetadataDisplay project={project} />

        <LogframeCard projectId={project.id} slug={slug} />
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
    </QueryProvider>
  );
}
