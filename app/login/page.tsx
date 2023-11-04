import Link from 'next/link';
import { cookies } from 'next/headers';
import { createClient } from '@/_utils/supabase/server';
import { redirect } from 'next/navigation';
import FormMessages from '@/_components/FormMessages';

export const signIn = async (formData: FormData) => {
  'use server';

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return redirect('/login?message=Could not authenticate user');
  }

  return redirect('/');
};

export default function Login() {
  return (
    <>
      <div className='max-w-6xl mx-auto pt-4'>
        <Link
          href='/'
          className='py-2 px-4 max-w-[90px] rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1'
          >
            <polyline points='15 18 9 12 15 6' />
          </svg>{' '}
          Back
        </Link>
      </div>

      <div className='mx-auto flex flex-col w-full px-8 pt-4 pb-16 sm:max-w-md justify-center gap-2'>
        <form
          className='flex-1 flex flex-col w-full justify-center gap-2 text-foreground'
          action='/auth/sign-in'
          method='post'
        >
          <label className='text-md' htmlFor='email'>
            Email
          </label>
          <input
            className='rounded-md px-4 py-2 bg-inherit border mb-6'
            name='email'
            placeholder='you@example.com'
            autoComplete='email'
            required
          />
          <label className='text-md' htmlFor='password'>
            Password
          </label>
          <input
            className='rounded-md px-4 py-2 bg-inherit border mb-6'
            type='password'
            name='password'
            placeholder='••••••••'
            autoComplete='current-password'
            required
          />
          <FormMessages />
          <button className='bg-green-700 text-white rounded-md px-4 py-2 text-foreground mb-2'>
            Sign In
          </button>
          <p className='mt-4 text-center'>
            <Link href='/requestpasswordreset' className='text-sm'>
              Reset password <span className='text-xs ml-1'>&rarr;</span>
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}
