import { signOutAction } from '@/app/actions';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Button } from '../ui/button';
import { User } from '@supabase/supabase-js';
import { MenuIcon } from 'lucide-react';

export default async function AuthButton({ user }: { user: User }) {
  return user ? (
    <DropdownMenu>
      <DropdownMenuTrigger className='flex items-center gap-4 rounded-md border px-2 py-1 transition-colors hover:bg-sky-800/50'>
        <p className='text-xs'>{user.email}</p> <MenuIcon className='h-4 w-4' />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Link href='/reset-password' className='px-4'>
            Change password
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <form action={signOutAction}>
            <button type='submit' className='px-4'>
              Sign out
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <div className='flex gap-2'>
      <Button asChild size='sm' variant='outline'>
        <Link href='/sign-in'>Sign in</Link>
      </Button>
    </div>
  );
}
