import ImpactIndicatorList from '@/components/impact-indicator/impact-indicator-list';
import FeatureCard from '@/components/ui/feature-card';
import PageHeading from '@/components/ui/page-heading';
import { createClient } from '@/utils/supabase/server';
import { ImpactIndicator } from '@/utils/types';

export default async function ImpactIndicatorsPage() {
  const supabase = await createClient();
  const { data: impactIndicators, error } = await supabase
    .from('impact_indicators')
    .select('*')
    .order('id', { ascending: true });

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
      <FeatureCard>
        <ImpactIndicatorList
          impactIndicators={impactIndicators as ImpactIndicator[]}
        />
      </FeatureCard>
    </div>
  );
}
