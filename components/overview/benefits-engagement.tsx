'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import * as d3 from 'd3';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ALL_TIME_FROM_DATE,
  ENGAGEMENT_INDICATORS,
  INDICATOR_IDS,
} from './pillar-config';
import {
  fetchPillarStoriesData,
  type IndicatorRollup,
  type PillarStoriesData,
} from './pillar-stories-server-actions';

const NOT_YET_REPORTED = 'Not yet reported';

function indicatorHref(code: string, toIso: string | null): string | null {
  const id = INDICATOR_IDS[code];
  if (id === undefined || !toIso) return null;
  return `/impactindicators/${id}?from=${ALL_TIME_FROM_DATE}&to=${toIso}`;
}

function metricHref(
  codes: readonly string[],
  toIso: string | null,
): string | null {
  if (codes.length !== 1) return null;
  return indicatorHref(codes[0], toIso);
}

function formatEngagementValue(
  rollups: readonly (IndicatorRollup | undefined)[],
): string | null {
  const total = rollups.reduce((sum, rollup) => {
    return sum + (rollup?.total_value ?? 0);
  }, 0);
  if (total <= 0) return null;
  return d3.format(',.0f')(total);
}

function useOverviewData() {
  return useQuery<PillarStoriesData>({
    queryKey: ['impact-pillar-stories', 'org-wide'],
    queryFn: fetchPillarStoriesData,
    staleTime: 10 * 60 * 1000,
  });
}

function EngagementMetricCard({
  title,
  hint,
  value,
  unitLabel,
  href,
  isLoading,
}: Readonly<{
  title: string;
  hint: string;
  value: string | null;
  unitLabel: string;
  href: string | null;
  isLoading: boolean;
}>) {
  if (isLoading) {
    return (
      <article className='flex flex-col gap-4 rounded-xl border border-border/80 bg-card p-6 shadow-sm'>
        <Skeleton className='h-5 w-2/3' />
        <Skeleton className='h-10 w-full' />
        <Skeleton className='h-8 w-24' />
        <Skeleton className='h-4 w-20' />
      </article>
    );
  }

  const valueBlock =
    value === null ? (
      <p className='text-2xl font-semibold text-muted-foreground'>
        {NOT_YET_REPORTED}
      </p>
    ) : (
      <p className='text-4xl font-bold tabular-nums tracking-tight text-foreground'>
        {value}
      </p>
    );

  return (
    <article className='flex h-full flex-col gap-4 rounded-xl border border-border/80 bg-card p-6 shadow-sm'>
      <div className='flex flex-col gap-2'>
        <h3 className='text-base font-semibold leading-tight'>{title}</h3>
        <p className='text-sm leading-snug text-muted-foreground'>{hint}</p>
      </div>
      <div className='mt-auto flex flex-col gap-1'>
        {href && value !== null ? (
          <Link
            href={href}
            className='w-fit hover:text-sky-600 hover:underline dark:hover:text-sky-400'
          >
            {valueBlock}
          </Link>
        ) : (
          valueBlock
        )}
        {value !== null && (
          <p className='text-sm text-muted-foreground'>{unitLabel}</p>
        )}
      </div>
    </article>
  );
}

export default function BenefitsEngagement() {
  const { data, isLoading, error } = useOverviewData();
  const toIso = data?.todayIso ?? null;

  if (error) {
    return (
      <p className='text-sm text-muted-foreground'>
        Failed to load connecting people to the sea: {(error as Error).message}
      </p>
    );
  }

  return (
    <section className='flex flex-col gap-5'>
      <header className='flex flex-col gap-1.5'>
        <p className='text-[10px] font-medium uppercase tracking-widest text-muted-foreground'>
          Cross-cutting
        </p>
        <h2 className='text-2xl font-semibold tracking-tight'>
          Connecting people to the sea
        </h2>
        <p className='max-w-3xl text-sm text-foreground'>
          Who benefits from the work, who takes action, and who completes public
          or student education programs.
        </p>
        <p className='text-sm text-muted-foreground'>
          Totals from valid indicator updates across active projects. Open a row
          for history and methodology.
        </p>
      </header>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        {ENGAGEMENT_INDICATORS.map((ind) => {
          const rolls = ind.codes.map((code) => data?.indicators[code]);
          return (
            <EngagementMetricCard
              key={ind.codes.join('+')}
              title={ind.label}
              hint={ind.hint}
              value={formatEngagementValue(rolls)}
              unitLabel={ind.unitLabel}
              href={metricHref(ind.codes, toIso)}
              isLoading={isLoading}
            />
          );
        })}
      </div>
    </section>
  );
}
