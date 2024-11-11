import { createClient } from '@/utils/supabase/server';
import FeatureCard from '../ui/feature-card';
import { Suspense } from 'react';
import UpdatesChart from './updates-chart';

export default async function UpdatesChartWrapper() {
  const supabase = await createClient();

  const { data: updates, error } = await supabase
    .from('updates')
    .select('created_at')
    .order('created_at', { ascending: false })
    .gte(
      'created_at',
      new Date(new Date().setDate(new Date().getDate() - 105)).toISOString(),
    );

  if (error) {
    return (
      <FeatureCard title='Updates Chart'>
        <p>Error fetching updates from database: {error.message}</p>
      </FeatureCard>
    );
  }

  return (
    <FeatureCard title='Weekly number of updates'>
      <Suspense fallback={<div>Loading...</div>}>
        <UpdatesChart updates={updates} />
      </Suspense>
    </FeatureCard>
  );
}
