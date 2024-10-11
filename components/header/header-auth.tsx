import { signOutAction } from '@/app/actions';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Button } from '../ui/button';
import { User } from '@supabase/supabase-js';
import { MenuIcon } from 'lucide-react';

export default async function AuthButton({ user }: { user: User }) {
  return user ? (
    <DropdownMenu>
      <DropdownMenuTrigger className='flex items-center gap-2 rounded-md border px-2 py-1'>
        <p className='text-xs'>{user.email}</p> <MenuIcon className='h-5 w-5' />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Your account</DropdownMenuLabel>
        <DropdownMenuSeparator />
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
