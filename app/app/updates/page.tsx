import { createClient } from '@/_utils/supabase/server';
import UpdateLarge from '@/_components/UpdateLarge';
import ErrorState from '@/_components/ErrorState';

export default async function Updates() {
  const supabase = createClient();

  const { data: updates, error } = await supabase
    .from('updates')
    .select(
      '*, projects (*), impact_indicators(*), output_measurables (*, impact_indicators (*))'
    )
    .eq('valid', 'true')
    .eq('original', 'true')
    .order('date', { ascending: false });

  if (error) {
    console.log(`Failed to fetch projects: ${error.message}`);
    return <ErrorState message={error.message} />;
  }

  return (
    <div className='animate-in'>
      <div className='pt-4 pb-24'>
        <h2 className='text-2xl font-bold mb-6'>Updates</h2>
        {updates &&
          updates.map((u) => {
            return <UpdateLarge key={u.id} update={u} />;
          })}
      </div>
    </div>
  );
}
