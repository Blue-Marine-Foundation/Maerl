import OverviewSectionHeader from './overview-section-header';
import PortfolioImpactCard from './portfolio-impact-card';
import { fetchPortfolioImpact } from './portfolio-impact-server-actions';

export default async function RecentUpdatesPanel() {
  const data = await fetchPortfolioImpact();

  if (data.variant === 'reviewer') {
    return (
      <section className='flex flex-col gap-4'>
        <OverviewSectionHeader title='Recent updates' />
        <p className='text-sm text-muted-foreground'>
          Portfolio updates appear for project assignments. Use Needs your
          attention above for review queues.
        </p>
      </section>
    );
  }

  if (data.variant === 'unassigned') {
    return (
      <section className='flex flex-col gap-4'>
        <OverviewSectionHeader title='Recent updates' />
        <p className='text-sm text-muted-foreground'>
          Assign yourself to projects to see recent evidenced wins here.
        </p>
      </section>
    );
  }

  const hasUpdates = data.updates.length > 0;
  const viewAllHref = hasUpdates
    ? `/updates?scope=mine&from=${data.updateDateRange.from}&to=${data.updateDateRange.to}`
    : undefined;

  return (
    <section className='flex flex-col gap-4'>
      <OverviewSectionHeader
        title='Recent updates'
        viewAllHref={viewAllHref}
        viewAllLabel={hasUpdates ? 'View my updates' : undefined}
      />

      {!hasUpdates ? (
        <p className='text-sm text-muted-foreground'>
          No updates from you yet on your assigned projects.
        </p>
      ) : (
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {data.updates.map((update) => (
            <PortfolioImpactCard key={update.id} update={update} />
          ))}
        </div>
      )}
    </section>
  );
}
