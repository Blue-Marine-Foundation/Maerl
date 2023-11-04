import { createClient } from '@/_utils/supabase/server';
import { cookies } from 'next/headers';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Index() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    return (
      <div className='max-w-6xl mx-auto text-center py-12'>
        <p className='text-4xl mb-4'>🐬</p>
        <h1 className='mb-8 text-3xl font-bold'>Maerl</h1>
        <p>
          <Link href='/dashboard' className='underline'>
            Go to your dashboard
          </Link>{' '}
          &nbsp; <span>&rarr;</span>
        </p>
      </div>
    );
  }

  return (
    <div className='max-w-6xl mx-auto text-center py-24'>
      <p className='text-4xl mb-4'>🐬</p>
      <h1 className='mb-8 text-3xl font-bold'>Meteor</h1>
      <p>
        <Link href='/login' className='underline'>
          Log in
        </Link>{' '}
        to get started
      </p>
    </div>
  );
}
