import { signInAction } from '@/app/actions';
import { FormMessage, Message } from '@/components/form-message';
import { SubmitButton } from '@/components/submit-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default function Login({ searchParams }: { searchParams: Message }) {
  return (
    <div>
      <form className='flex min-w-64 flex-col gap-8'>
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
          <SubmitButton pendingText='Signing In...' formAction={signInAction}>
            Sign in
          </SubmitButton>
          <FormMessage message={searchParams} />
        </div>
      </form>
    </div>
  );
}
