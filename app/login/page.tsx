'use client';

import { useState } from 'react';
import Link from 'next/link';
import FormMessages from '@/components/FormMessages';

export default function Login() {
  const [loggingIn, setLoggingIn] = useState(false);

  return (
    <>
      <div className='max-w-7xl mx-auto pt-6'>
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
          onSubmit={() => setLoggingIn(true)}
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
          <button className='bg-btn-background hover:bg-btn-background-hover transition-all duration-500 text-white rounded-md px-4 py-2 text-foreground mb-2'>
            {loggingIn ? (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                stroke-width='2'
                stroke-linecap='round'
                stroke-linejoin='round'
                className='mx-auto animate-spin text-purple-200'
              >
                <line x1='12' x2='12' y1='2' y2='6' />
                <line x1='12' x2='12' y1='18' y2='22' />
                <line x1='4.93' x2='7.76' y1='4.93' y2='7.76' />
                <line x1='16.24' x2='19.07' y1='16.24' y2='19.07' />
                <line x1='2' x2='6' y1='12' y2='12' />
                <line x1='18' x2='22' y1='12' y2='12' />
                <line x1='4.93' x2='7.76' y1='19.07' y2='16.24' />
                <line x1='16.24' x2='19.07' y1='7.76' y2='4.93' />
              </svg>
            ) : (
              'Log in'
            )}
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
