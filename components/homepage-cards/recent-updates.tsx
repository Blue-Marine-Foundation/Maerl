import { createClient } from '@/utils/supabase/server';
import FeatureCard from '../ui/feature-card';
import UpdatesListMedium from '../updates/updates-list-medium';

export default async function RecentUpdates() {
  const supabase = await createClient();

  const { data: updates, error } = await supabase
    .from('updates')
    .select(
      '*, projects(name, slug), output_measurables(*), impact_indicators(*)',
    )
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    return (
      <FeatureCard title='Recent Updates'>
        <div className='flex grow flex-col gap-2'>
          <p>Error fetching updates from database: {error.message}</p>
        </div>
      </FeatureCard>
    );
  }

  return (
    <FeatureCard title='Recent Updates'>
      <UpdatesListMedium updates={updates} />
    </FeatureCard>
  );
}
