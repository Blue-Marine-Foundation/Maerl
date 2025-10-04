import { signInAction } from '@/app/actions';
import { FormMessage, Message } from '@/components/form-message';
import { SubmitButton } from '@/components/submit-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import logo from '@/public/bluemarinefoundationlogo.svg';
import Link from 'next/link';

export default async function Login(props: { searchParams: Promise<Message> }) {
  const message = await props.searchParams;

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

          <button className='rounded-md bg-sky-700 p-2 text-foreground hover:bg-sky-800'>
            Sign in with Microsoft
          </button>
        </div>
      </div>
    </div>
  );
}
