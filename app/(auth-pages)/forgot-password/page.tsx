import { forgotPasswordAction } from '@/app/actions';
import { FormMessage, Message } from '@/components/form-message';
import { SubmitButton } from '@/components/submit-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default async function ForgotPassword(
  props: {
    searchParams: Promise<Message>;
  }
) {
  const searchParams = await props.searchParams;
  return (
    <div className='mx-auto flex w-full min-w-64 max-w-96 flex-1 flex-col gap-2'>
      <form className='mb-12 text-foreground [&>input]:mb-6'>
        <div>
          <h1 className='text-2xl font-medium'>Request Password Reset</h1>
        </div>
        <div className='mt-8 flex flex-col gap-2 [&>input]:mb-3'>
          <Label htmlFor='email'>Email</Label>
          <Input name='email' placeholder='you@example.com' required />
          <SubmitButton formAction={forgotPasswordAction}>
            Reset Password
          </SubmitButton>
          <FormMessage message={searchParams} />
        </div>
      </form>
      <p className='text-center text-sm text-secondary-foreground'>
        <Link className='text-primary underline' href='/sign-in'>
          Sign in
        </Link>
      </p>
    </div>
  );
}
