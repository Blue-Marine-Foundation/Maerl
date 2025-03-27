// TODO: Once db updates done, update data fetchin as needed
// and test if Edit Update works with editing relevant output indicators

import ProjectUpdatesDataTable from '@/components/updates/project-updates-data-table';

import { createClient } from '@/utils/supabase/server';
export default async function UnitUpdatesPage({
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
