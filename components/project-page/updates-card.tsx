import { createClient } from '@/utils/supabase/server';
import FeatureCard from '@/components/ui/feature-card';
import { Suspense } from 'react';
import UpdatesChart from '@/components/homepage-cards/updates-chart';

export default async function ProjectUpdatesCard({
  projectId,
}: {
  projectId: number;
}) {
  const supabase = await createClient();

  const { data: updates, error } = await supabase
    .from('updates')
    .select('created_at')
    .order('created_at', { ascending: false })
    .gte(
      'created_at',
      new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString(),
    )
    .eq('project_id', projectId);

  if (error) {
    return (
      <FeatureCard title='Updates Chart'>
        <p>Error fetching updates from database: {error.message}</p>
      </FeatureCard>
    );
  }

  return (
    <FeatureCard title='Weekly updates'>
      <Suspense fallback={<div>Loading...</div>}>
        <UpdatesChart updates={updates} />
      </Suspense>
    </FeatureCard>
  );
}
