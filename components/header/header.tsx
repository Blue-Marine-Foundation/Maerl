import Link from 'next/link';
import AuthButton from './header-auth';
import { createClient } from '@/utils/supabase/server';
import { Button } from '../ui/button';
import PrimaryNavigation from './primary-nav';

export default async function Header() {
  const {
    data: { user },
  } = await createClient().auth.getUser();

  return (
    <div className='max-w-app mx-auto w-full border-b py-4'>
      <div className='flex items-baseline justify-between gap-4'>
        <h2 className='text-lg font-semibold'>
          <Link href='/'>Maerl</Link>
        </h2>
        {user ? (
          <AuthButton user={user} />
        ) : (
          <Button asChild size='sm' variant='outline'>
            <Link href='/sign-in'>Sign in</Link>
          </Button>
        )}
      </div>

      {user && <PrimaryNavigation />}
    </div>
  );
}
