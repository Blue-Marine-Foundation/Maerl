'use client';

import { useSearchParams } from 'next/navigation';

export default function FormMessages() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const message = searchParams.get('message');
  return (
    <>
      {error && (
        <p className='mb-4 p-2 bg-red-50 border rounded-md border-red-300 text-foreground text-center dark:bg-red-300 dark:text-red-900'>
          {error}
        </p>
      )}
      {message && (
        <p className='mb-4 p-2 bg-slate-50 border rounded-md border-slate-300 text-foreground text-center dark:bg-slate-300 dark:text-slate-900'>
          {message}
        </p>
      )}
    </>
  );
}
