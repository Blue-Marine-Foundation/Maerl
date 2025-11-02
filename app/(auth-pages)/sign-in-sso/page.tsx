'use client';

import Image from 'next/image';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';
import logo from '@/public/bluemarinefoundationlogo.svg';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function Login() {
  const searchParams = useSearchParams();

  // Handle error messages from callback redirect
  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      toast.error('Failed to sign in with Microsoft', {
        description: decodeURIComponent(error),
      });
      // Clean up URL by removing error parameter
      const url = new URL(window.location.href);
      url.searchParams.delete('error');
      window.history.replaceState({}, '', url.toString());
    }
  }, [searchParams]);
  const handleAzureSignIn = async () => {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'azure',
        options: {
          scopes: 'openid email profile',
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.error('Azure sign-in error:', error);
        toast.error('Failed to sign in with Microsoft', {
          description: error.message || 'Please try again later.',
        });
      }
    } catch (error) {
      console.error('Unexpected error during Azure sign-in:', error);
      toast.error('An unexpected error occurred', {
        description: 'Please try again later.',
      });
    }
  };

  return (
    <div className='max-w-app mx-auto flex w-full justify-between gap-8'>
      <div className='flex min-h-96 basis-1/2 flex-col items-center justify-center gap-12 rounded-lg bg-card p-8'>
        <Image src={logo} alt='Maerl Logo' width={100} height={100} />
        <div className='flex flex-col items-center gap-2'>
          <h2 className='text-2xl font-medium'>Maerl</h2>
          <p className='text-sm text-muted-foreground'>
            Impact monitoring for Blue Marine Foundation
          </p>
        </div>
      </div>
      <div className='flex basis-1/2 flex-col items-center justify-center rounded-lg bg-card p-8'>
        <div className='flex w-80 flex-col gap-8'>
          <h1 className='text-2xl font-medium'>Sign in</h1>

          <button
            onClick={handleAzureSignIn}
            className='rounded-md bg-sky-700 p-2 text-foreground hover:bg-sky-800'
          >
            Sign in with Microsoft
          </button>
        </div>
      </div>
    </div>
  );
}
