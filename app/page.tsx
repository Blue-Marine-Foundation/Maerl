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
    <div className='max-w-6xl mx-auto text-center py-32 animate-in'>
      <h1 className='mb-8 text-3xl font-bold'>Maerl</h1>
      <p className='mb-12'>Impact reporting by Blue Marine Foundation</p>
      <p>
        <Link
          href='/login'
          className='px-8 py-2 bg-btn-background hover:bg-btn-background-hover rounded shadow transition-all duration-500'
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
