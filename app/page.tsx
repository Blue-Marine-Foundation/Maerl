import RecentProjects from '@/components/homepage-cards/recent-projects';
import RecentUpdates from '@/components/homepage-cards/recent-updates';
import UpdatesChartWrapper from '@/components/homepage-cards/updates-chart-wrapper';
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
    <div className="max-w-app mx-auto flex w-full flex-col gap-8 py-8">
      <div className='grid grid-cols-[3fr_6fr] items-start gap-8'>
        <div className='flex flex-col justify-start gap-8'>
          <RecentProjects />
          <UpdatesChartWrapper />
        </div>

        <RecentUpdates />
      </div>
    </div>
  );
}
