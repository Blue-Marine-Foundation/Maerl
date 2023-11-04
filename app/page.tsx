import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Index() {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    return (
      <div className='max-w-6xl mx-auto py-24 text-center animate-in'>
        <p className='text-4xl mb-4'>🐬</p>
        <h1 className='mb-12 text-3xl font-bold'>Maerl</h1>
        <p>
          <Link
            href='/dashboard'
            className='rounded-md py-3 px-5 bg-slate-200 transition-all ease-in duration-300 hover:bg-slate-300 dark:bg-slate-800  dark:hover:bg-slate-700 '
          >
            Go to your dashboard <span className='pl-2'>&rarr;</span>
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className='max-w-6xl mx-auto text-center py-24 animate-in'>
      <p className='text-4xl mb-4'>🐬</p>
      <h1 className='mb-8 text-3xl font-bold'>Maerl</h1>
      <p>
        <Link href='/login' className='underline'>
          Log in
        </Link>{' '}
        to get started
      </p>
    </div>
  );
}
