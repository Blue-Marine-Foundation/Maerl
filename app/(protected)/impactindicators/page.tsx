import ImpactIndicatorList from '@/components/impact-indicators/impact-indicator-list';
import BenefitsEngagement from '@/components/overview/benefits-engagement';
import PillarStories from '@/components/overview/pillar-stories';
import FeatureCard from '@/components/ui/feature-card';
import PageHeading from '@/components/ui/page-heading';

export default function ImpactPage() {
  return (
    <div className='flex flex-col gap-10'>
      <div className='flex max-w-2xl flex-col gap-2'>
        <PageHeading>Impact</PageHeading>
        <p className='text-sm text-muted-foreground'>
          What we&apos;ve achieved — organisation-wide rollups by Strategic
          Goal, then the full indicator catalogue for drill-down.
        </p>
      </div>

      <section className='flex flex-col gap-4'>
        <div>
          <h2 className='text-lg font-semibold'>Impact by Strategic Goal</h2>
          <p className='mt-1 text-sm text-muted-foreground'>
            All-time impact totals across active projects, counting only Impact
            Updates approved by an admin as valid, verified, and not duplicate.
          </p>
        </div>
        <PillarStories />
      </section>

      <BenefitsEngagement />

      <section className='flex flex-col gap-4 border-t border-border/80 pt-10'>
        <div>
          <h2 className='text-lg font-semibold'>Indicator catalogue</h2>
          <p className='mt-1 text-sm text-muted-foreground'>
            All impact indicators with summarised values. Filter, sort, and
            export. Totals include only numeric Impact Updates approved by an
            admin as valid, verified, and not duplicate. Updates pending review,
            unverified updates, invalid updates, duplicates, and Progress
            Updates are excluded.
          </p>
        </div>
        <FeatureCard>
          <ImpactIndicatorList />
        </FeatureCard>
      </section>
    </div>
  );
}
