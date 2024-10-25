import { signInAction } from '@/app/actions';
import { FormMessage, Message } from '@/components/form-message';
import { SubmitButton } from '@/components/submit-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import logo from '@/public/bluemarinefoundationlogo.svg';
import Link from 'next/link';

export default async function Login({
  searchParams,
}: {
  searchParams: Message;
}) {
  const message = await searchParams;

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
        <form className='flex w-80 flex-col gap-8'>
          <h1 className='text-2xl font-medium'>Sign in</h1>
          <div className='flex flex-col gap-2 [&>input]:mb-3'>
            <Label htmlFor='email'>Email</Label>
            <Input name='email' placeholder='you@example.com' required />
            <div className='flex items-center justify-between'>
              <Label htmlFor='password'>Password</Label>
              <Link
                className='text-xs text-foreground underline'
                href='/forgot-password'
              >
                Forgot Password?
              </Link>
            </div>
            <Input
              type='password'
              name='password'
              placeholder='Your password'
              required
            />
            <SubmitButton
              className='bg-sky-700 text-foreground hover:bg-sky-800'
              pendingText='Signing In...'
              formAction={signInAction}
            >
              Sign in
            </SubmitButton>
            <FormMessage message={message} />
          </div>
        </form>
      </div>
    </div>
  );
}
