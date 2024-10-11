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
    <div className='max-w-app mx-auto flex w-full items-center justify-between gap-4 py-4'>
      <div className='flex items-baseline justify-start gap-8'>
        <h2 className='text-lg font-semibold'>
          <Link href='/'>Start Here</Link>
        </h2>
        {user && <PrimaryNavigation />}
      </div>

      {user ? (
        <AuthButton user={user} />
      ) : (
        <Button asChild size='sm' variant='outline'>
          <Link href='/sign-in'>Sign in</Link>
        </Button>
      )}
    </div>
  );
}
