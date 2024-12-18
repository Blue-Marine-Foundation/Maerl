import ImpactIndicatorList from '@/components/impact-indicators/impact-indicator-list';
import FeatureCard from '@/components/ui/feature-card';
import PageHeading from '@/components/ui/page-heading';
import { createClient } from '@/utils/supabase/server';
import { ImpactIndicator, ImpactIndicatorSummary } from '@/utils/types';

export default async function ImpactIndicatorsPage() {
  const supabase = await createClient();
  const { data: impactIndicators, error } = await supabase
    .from('impact_indicator_summaries')
    .select('*')
    .order('impact_indicator_id', { ascending: true });

  if (error) {
    <FeatureCard title='Error'>
      <div className='flex flex-col gap-2'>
        <h3 className='text-lg font-medium'>Error</h3>
        <p className='text-sm text-muted-foreground'>{error.message}</p>
      </div>
    </FeatureCard>;
  }

  return (
    <div className='flex flex-col gap-6'>
      <PageHeading>Impact Indicators</PageHeading>
      <p className=''>
        Summarised values are collated from updates that are{' '}
        <strong>valid</strong> and <strong>original</strong>. Duplicates and
        invalid updates are excluded.
      </p>
      <FeatureCard>
        <ImpactIndicatorList
          impactIndicators={impactIndicators as ImpactIndicatorSummary[]}
        />
      </FeatureCard>
    </div>
  );
}
