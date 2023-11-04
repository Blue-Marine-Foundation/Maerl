import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

export default async function AuthButton() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? (
    <div className='flex items-center gap-4 text-sm'>
      <p>
        <Link href='/dashboard/account'> {user.email}</Link>
      </p>
      <form action='/auth/sign-out' method='post'>
        <button className='py-1.5 px-3 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover text-sm'>
          Logout
        </button>
      </form>
    </div>
  ) : (
    <Link
      href='/login'
      className='py-1.5 px-3 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover text-sm'
    >
      Login
    </Link>
  );
}
