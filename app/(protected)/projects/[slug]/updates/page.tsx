import ProjectUpdatesDataTable from '@/components/updates/project-updates-data-table';

import { createClient } from '@/utils/supabase/server';
export default async function ProjectUpdatesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('projects')
    .select('id')
    .eq('slug', slug as string)
    .single();

  if (error) {
    return (
      <div className='flex flex-col gap-4'>
        <p>Error fetching updates: {error.message}</p>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-4'>
      <ProjectUpdatesDataTable projectId={data.id} />
    </div>
  );
}
