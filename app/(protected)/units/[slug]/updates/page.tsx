import { createClient } from '@/utils/supabase/server';
import UnitUpdatesDataTable from '@/components/units/unit-updates-data-table';
import FeatureCard from '@/components/ui/feature-card';

export default async function UnitUpdatesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('unit_contribution_updates')
    .select('*')
    .eq('unit_slug', slug)
    .order('date', { ascending: false });

  if (error) {
    return (
      <div className='flex flex-col gap-4'>
        <p>Error fetching updates: {error.message}</p>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-6'>
      <FeatureCard>
        <UnitUpdatesDataTable data={data} />
      </FeatureCard>
    </div>
  );
}
