import IndicatorUpdates from '@/components/impact-indicators/indicator-updates';
import Breadcrumbs from '@/components/ui/breadcrumbs';
import FeatureCard from '@/components/ui/feature-card';
import { createClient } from '@/utils/supabase/server';
import SetDateRange from '@/components/date-filtering/set-date-range';
export default async function IndicatorUpdatesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('impact_indicators')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return (
      <FeatureCard>
        <div className='flex flex-col gap-2'>
          Error loading impact indicator: {(error as Error).message}
        </div>
      </FeatureCard>
    );
  }

  return (
    <div className='flex flex-col gap-8'>
      <Breadcrumbs type='impactindicator' />
      <div className='flex items-start justify-between gap-12'>
        <div className='flex flex-col gap-2'>
          <h3 className='font-semibold tracking-wide text-muted-foreground'>
            Impact Indicator {data.indicator_code}
          </h3>
          <h2 className='text-2xl font-semibold'>{data.indicator_title}</h2>
        </div>
        <SetDateRange />
      </div>

      <IndicatorUpdates />
    </div>
  );
}
