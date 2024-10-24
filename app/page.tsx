import RecentProjects from '@/components/homepage-cards/recent-projects';
import RecentUpdates from '@/components/homepage-cards/recent-updates';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function Index() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/sign-in');
  }

  return (
    <div className={`max-w-app mx-auto flex w-full flex-col gap-8 py-8`}>
      <p>Monitoring and evaluation for Blue Marine Foundation</p>
      <div className='grid grid-cols-[3fr_6fr] items-start gap-8'>
        <div className='flex flex-col gap-8'>
          <RecentProjects />
          <RecentProjects />
        </div>

        <RecentUpdates />
      </div>
    </div>
  );
}
