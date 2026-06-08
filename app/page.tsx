import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import PortfolioSummaryStats from '@/components/overview/portfolio-summary-stats';
import ForYouPanel from '@/components/overview/for-you-panel';
import RecentUpdatesPanel from '@/components/overview/recent-updates-panel';
import ActivityHeatmap from '@/components/overview/activity-heatmap';

function fallbackName(email?: string | null): string {
  return email?.split('@')[0] || 'there';
}

export default async function Index() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/sign-in');
  }

  const { data: profile } = await supabase
    .from('users')
    .select('first_name')
    .eq('id', user.id)
    .maybeSingle();

  const firstName =
    typeof profile?.first_name === 'string' && profile.first_name.trim()
      ? profile.first_name.trim()
      : fallbackName(user.email);

  return (
    <div className='max-w-app mx-auto flex w-full flex-col gap-8 py-8'>
      <section>
        <h1 className='text-2xl font-medium tracking-tight text-foreground'>
          Welcome back, {firstName}.
        </h1>
      </section>

      <ActivityHeatmap />

      <PortfolioSummaryStats />

      <ForYouPanel />

      <RecentUpdatesPanel />
    </div>
  );
}
