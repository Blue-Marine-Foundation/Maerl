import ErrorState from '@/_components/ErrorState';
import UpdateLarge from '@/_components/UpdateLarge';
import { createClient } from '@/_utils/supabase/server';
import { Params } from '@/lib/types';
import Link from 'next/link';

async function Page({ params }: { params: Params }) {
  const supabase = createClient();
  const { data: updates, error } = await supabase
    .from('updates')
    .select(
      '*, projects!inner(*), impact_indicators(*), output_measurables (*, impact_indicators (*))'
    )
    .order('date', { ascending: false })
    .eq('valid', 'true')
    .eq('original', 'true')
    .eq('projects.slug', params.slug);

  if (error) {
    console.log(error);
    return <ErrorState message={error.message} />;
  }

  if (updates.length == 0) {
    return (
      <div className='w-full animate-in'>
        <div className='bg-card-bg p-24 flex flex-col gap-8 items-center rounded-lg'>
          <h2 className='text-xl font-semibold'>No updates</h2>
          <Link
            href='/app/newupdate'
            className='px-4 py-2 flex justify-between items-center gap-2 text-sm rounded-md bg-btn-background hover:bg-btn-background-hover transition-all duration-500'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='16'
              height='16'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2.5'
              strokeLinecap='round'
              strokeLinejoin='round'
              className=''
            >
              <path d='M5 12h14' />
              <path d='M12 5v14' />
            </svg>{' '}
            <span>Add the first update</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className='w-full animate-in'>
        <h2 className='text-2xl font-bold mb-8'>
          {updates[0].projects.name} Updates
        </h2>

        {updates.map((update) => {
          return <UpdateLarge key={update.id} update={update} />;
        })}
      </div>
    </>
  );
}

export default Page;
