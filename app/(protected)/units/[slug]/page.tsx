import { createClient } from '@/utils/supabase/server';
import ProjectMetadataDisplay from '@/components/project-metadata/project-metadata-display';
import ProjectUpdatesCard from '@/components/project-page/updates-card';

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
      <div className='flex flex-col gap-4'>
        <ProjectUpdatesCard projectId={project.id} />
        <div className='flex flex-col rounded-md bg-card p-4'>
          <h3 className='mb-auto text-sm font-semibold text-muted-foreground'>
            Funding requests
          </h3>
          <div className='flex flex-grow flex-col items-center justify-start gap-2 py-4'>
            <p className='text-foreground/80'>
              Funding requests via Maerl are temporarily disabled. We&apos;re
              working to bring them back soon!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
