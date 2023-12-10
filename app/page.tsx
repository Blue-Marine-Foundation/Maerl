import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Index() {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    return redirect('/app');
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
