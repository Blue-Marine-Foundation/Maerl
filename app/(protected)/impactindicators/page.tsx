import ImpactIndicatorList from '@/components/impact-indicators/impact-indicator-list';
import FeatureCard from '@/components/ui/feature-card';
import PageHeading from '@/components/ui/page-heading';

export default function ImpactIndicatorsPage() {
  return (
    <div className='flex flex-col gap-6'>
      <PageHeading>Impact Indicators</PageHeading>
      <p>
        Summarised values are collated from updates that are{' '}
        <strong>valid</strong> and <strong>original</strong>. Duplicates and
        invalid updates are excluded.
      </p>
      <FeatureCard>
        <ImpactIndicatorList />
      </FeatureCard>
    </div>
  );
}
