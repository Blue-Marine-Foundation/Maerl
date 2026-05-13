import { fetchCurrentUserProfile } from '@/api/fetch-current-user-profile';

export default async function Greeting() {
  const { profile } = await fetchCurrentUserProfile();

  const firstName = profile?.first_name?.trim() || null;
  const currentYear = new Date().getFullYear();

  return (
    <div className='flex flex-col gap-1'>
      <h1 className='text-2xl font-bold'>
        {firstName ? `Welcome back, ${firstName}.` : 'Welcome back.'}
      </h1>
      <p className='text-sm text-muted-foreground'>
        Maerl in {currentYear} — the story so far.
      </p>
    </div>
  );
}
