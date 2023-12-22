import Update from '@/_components/UpdateMedium';
import { createClient } from '@/_utils/supabase/server';
import { Params } from '@/lib/types';

async function Page({ params }: { params: Params }) {
  console.log(params);

  const supabase = createClient();
  const { data: updates, error } = await supabase
    .from('updates')
    .select(
      '*, projects!inner(*), output_measurables (*, impact_indicators (*))'
    )
    .order('date', { ascending: false })
    .eq('projects.slug', params.slug);

  console.log(updates);

  if (!updates) {
    console.log(error);
    return (
      <div className='w-full'>
        <h2 className='text-2xl font-bold mb-8'>{`${params.slug} Updates`}</h2>

        <p>No updates found... {error.message}</p>
      </div>
    );
  }

  return (
    <>
      <div className='w-full animate-in'>
        <h2 className='text-2xl font-bold mb-8'>{params.slug} Updates</h2>

        {updates.map((update) => {
          return <Update key={update.id} update={update} />;
        })}
      </div>
    </>
  );
}

export default Page;
