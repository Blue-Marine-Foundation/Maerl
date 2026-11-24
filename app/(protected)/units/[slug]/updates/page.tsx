import { createClient } from '@/utils/supabase/server';
import UnitUpdatesDataTable from '@/components/units/unit-updates-data-table';
import FeatureCard from '@/components/ui/feature-card';
import type { Update } from '@/utils/types';

export default async function UnitUpdatesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  // Retain the unit view's contribution scope, then load canonical update data
  // rather than reconstructing ownership and impact mappings from flat columns.
  const { data: contributions, error: contributionError } = await supabase
    .from('unit_contribution_updates')
    .select('id')
    .eq('unit_slug', slug)
    .order('date', { ascending: false });

  const ids = Array.from(new Set((contributions ?? []).map((row) => row.id)));
  const { data, error } = contributionError
    ? { data: null, error: contributionError }
    : ids.length === 0
      ? { data: [], error: null }
      : await supabase
          .from('updates')
          .select(
            '*, projects(*), output_measurables(*), outcome_measurables(*), impact_indicators(*), users(*)',
          )
          .in('id', ids)
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
        <UnitUpdatesDataTable data={(data ?? []) as Update[]} />
      </FeatureCard>
    </div>
  );
}
