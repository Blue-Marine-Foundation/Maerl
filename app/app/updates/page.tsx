import { createClient } from '@/_utils/supabase/server';
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
