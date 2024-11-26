import Link from 'next/link';
import AuthButton from './header-auth';
import { createClient } from '@/utils/supabase/server';
import { Button } from '../ui/button';
import PrimaryNavigation from './primary-nav';
import Logo from '../logo';

export default async function Header() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className='mx-auto w-full border-b p-4'>
      <div className='max-w-app mx-auto flex items-center justify-between gap-4'>
        <div className='flex items-center justify-start gap-6'>
          <h2 className='flex items-center justify-start gap-2 font-medium'>
            <Logo width={22} />
            <Link href='/'>Maerl</Link>
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
    </div>
  );
}
