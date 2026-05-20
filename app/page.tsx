import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import PortfolioSummaryStats from '@/components/overview/portfolio-summary-stats';
import ForYouPanel from '@/components/overview/for-you-panel';
import RecentUpdatesPanel from '@/components/overview/recent-updates-panel';

export default async function Index() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/sign-in');
  }

  return (
    <div className='max-w-app mx-auto flex w-full flex-col gap-6 py-6'>
      <PortfolioSummaryStats />

      <ForYouPanel />

      <RecentUpdatesPanel />
    </div>
  );
}
