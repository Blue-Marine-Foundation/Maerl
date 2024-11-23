import { createClient } from '@/utils/supabase/server';
import ProjectMetadataDisplay from '@/components/project-metadata/project-metadata-display';
import LogframeCard from '@/components/project-page/logframe-card';

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
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
    <div className='grid grid-cols-3 items-start gap-4'>
      <ProjectMetadataDisplay project={project} />

      <LogframeCard projectId={project.id} slug={slug} />
      <div className='flex flex-col gap-4'>
        {/* <div className='flex flex-col rounded-md bg-card p-4'>Thing</div> */}
        <div className='flex flex-col rounded-md bg-card p-4'>
          <h3 className='mb-auto text-sm font-semibold text-muted-foreground'>
            Funding requests
          </h3>
          <div className='flex flex-grow flex-col items-center justify-start gap-2 py-4'>
            <p className='text-foreground/80'>
              Funding requests via Maerl are temporarily disabled. We're working
              to bring them back soon!
            </p>
            {/* <button className='mt-2 flex items-center gap-2 rounded-md border border-dashed px-3 py-1.5 text-sm text-foreground/80 transition-all hover:border-solid hover:border-foreground/50 hover:text-foreground'>
              <PlusCircleIcon className='h-4 w-4' /> Create funding request
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}
