import IndicatorUpdates from '@/components/impact-indicators/indicator-updates';
import Breadcrumbs from '@/components/ui/breadcrumbs';
import FeatureCard from '@/components/ui/feature-card';
import { fetchImpactIndicator } from '@/api/fetch-impact-indicator';
import ImpactIndicatorSummary from '@/components/impact-indicators/impact-indicator-summary';

export default async function IndicatorUpdatesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data, error } = await fetchImpactIndicator(id);

  return (
    <div className='flex flex-col gap-8'>
      <Breadcrumbs type='impactindicator' />
      <div className='flex items-start justify-between gap-12'>
        <div className='flex flex-col gap-2'>
          <h3 className='font-semibold tracking-wide text-muted-foreground'>
            Impact Indicator {data ? data.indicator_code : id}
          </h3>
          {data && (
            <h2 className='text-2xl font-semibold'>{data.indicator_title}</h2>
          )}
        </div>
      </div>

      {error && (
        <FeatureCard>
          <div className='flex flex-col gap-2'>
            Error loading impact indicator {id}: {(error as Error).message}
          </div>
        </FeatureCard>
      )}

      {data && (
        <div className='flex flex-col gap-8 rounded-lg bg-card p-4'>
          <ImpactIndicatorSummary id={id} />
          <IndicatorUpdates />
        </div>
      )}
    </div>
  );
}
