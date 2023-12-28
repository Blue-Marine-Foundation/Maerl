import { createClient } from '@/_utils/supabase/server';
import Link from 'next/link';
import UpdateMedium from '@/_components/UpdateMedium';

export default async function Updates() {
  const supabase = createClient();

  const { data: updates, error } = await supabase
    .from('updates')
    .select('*, projects (*), output_measurables (*, impact_indicators (*))')
    .order('date', { ascending: false });

  if (error) {
    console.log(`Failed to fetch projects: ${error.message}`);
  }

  // @ts-ignore
  const project_list = updates
    .reduce((acc, u) => {
      const projectKey = u.projects.id; // Assuming id is unique for each project
      if (!acc.has(projectKey)) {
        acc.set(projectKey, {
          name: u.projects.name,
          id: projectKey,
          color: u.projects.highlight_color,
          slug: u.projects.slug,
        });
      }
      return acc;
    }, new Map())
    .values();

  return (
    <div className='animate-in'>
      <div className='pt-4 pb-24'>
        <h2 className='text-2xl font-bold mb-6'>Updates</h2>
        {updates &&
          updates.map((u) => {
            return <UpdateMedium key={u.id} update={u} />;
          })}
      </div>
    </div>
  );
}
