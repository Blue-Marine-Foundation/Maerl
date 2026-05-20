import * as d3 from 'd3';
import { fetchPortfolioImpact } from './portfolio-impact-server-actions';

function StatsStrip({
  stats,
}: Readonly<{
  stats: {
    activeProjectCount: number;
    validUpdateCount: number;
    indicatorCount: number;
  };
}>) {
  const items = [
    {
      value: stats.activeProjectCount,
      label:
        stats.activeProjectCount === 1 ? 'active project' : 'active projects',
    },
    {
      value: stats.validUpdateCount,
      label: stats.validUpdateCount === 1 ? 'valid update' : 'valid updates',
    },
    {
      value: stats.indicatorCount,
      label:
        stats.indicatorCount === 1
          ? 'impact indicator'
          : 'impact indicators',
    },
  ];

  return (
    <div
      className='flex flex-wrap items-center gap-x-10 gap-y-2 rounded-xl bg-muted/40 px-5 py-3.5 text-sm'
      aria-label='Your portfolio summary'
    >
      {items.map((item) => (
        <p key={item.label} className='text-muted-foreground'>
          <span className='font-semibold tabular-nums text-foreground'>
            {d3.format(',')(item.value)}
          </span>{' '}
          {item.label}
        </p>
      ))}
    </div>
  );
}

export default async function PortfolioSummaryStats() {
  const data = await fetchPortfolioImpact();

  if (data.variant !== 'portfolio' || !data.stats) {
    return null;
  }

  // With a single assigned project, the band repeats the row below; show once
  // you have portfolio breadth to roll up.
  if (data.stats.assignedProjectCount <= 1) {
    return null;
  }

  return <StatsStrip stats={data.stats} />;
}
