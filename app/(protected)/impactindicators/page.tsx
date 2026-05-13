import ImpactIndicatorList from '@/components/impact-indicators/impact-indicator-list';
import FeatureCard from '@/components/ui/feature-card';
import PageHeading from '@/components/ui/page-heading';

export default function ImpactPage() {
  return (
    <div className='flex flex-col gap-8'>
      <PageHeading>Impact</PageHeading>

      <section className='flex flex-col gap-4'>
        <div>
          <h2 className='text-lg font-semibold'>Indicator Catalogue</h2>
          <p className='mt-1 text-sm text-muted-foreground'>
            All impact indicators with summarised values. Filter, sort, and
            export. Summarised values are collated from updates that are{' '}
            <strong>valid</strong>. Duplicates and invalid updates are
            excluded.
          </p>
        </div>
        <FeatureCard>
          <ImpactIndicatorList />
        </FeatureCard>
      </section>
    </div>
  );
}
