'use client';

import { useId, useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ChevronDownIcon } from 'lucide-react';
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

const ENGAGEMENT_INDICATOR_LABELS: Record<string, string> = {
  '5.2.1': 'Monetary support',
  '5.2.2': 'In-kind support',
  '5.3.3': 'People taking action',
  '5.5.1': 'Education completed',
};

type EngagementIndicatorBreakdown = {
  code: string;
  label: string;
  fullTitle: string;
  value: string | null;
  href: string | null;
};

function conciseIndicatorLabel(code: string, title: string): string {
  return (
    ENGAGEMENT_INDICATOR_LABELS[code] ??
    title.replace(/^number of\s+/i, '').replace(/^no\.?\s+of\s+/i, '')
  );
}

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
  indicatorBreakdown,
  isLoading,
}: Readonly<{
  title: string;
  hint: string;
  value: string | null;
  unitLabel: string;
  href: string | null;
  indicatorBreakdown: readonly EngagementIndicatorBreakdown[];
  isLoading: boolean;
}>) {
  const [indicatorsOpen, setIndicatorsOpen] = useState(false);
  const indicatorPanelId = useId();

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
      <div className='flex flex-col gap-1'>
        {href && value !== null ? (
          <Link
            href={href}
            className='w-fit hover:text-primary hover:underline'
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
      <div className='relative mt-auto flex flex-col gap-3'>
        {indicatorsOpen && (
          <ul
            id={indicatorPanelId}
            className='absolute left-0 right-0 top-full z-10 mt-1 flex flex-col gap-1 rounded-lg border border-border/80 bg-card p-2 shadow-md'
          >
            {indicatorBreakdown.map((indicator) => {
              const rowClass =
                'grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-3 rounded-md px-1 py-1.5 text-sm';
              const rowContent = (
                <>
                  <span className='flex min-w-0 items-baseline gap-2.5'>
                    <span className='shrink-0 font-mono text-[11px] tabular-nums text-muted-foreground/75'>
                      {indicator.code}
                    </span>
                    <span
                      className='min-w-0 truncate'
                      title={indicator.fullTitle}
                    >
                      {indicator.label}
                    </span>
                  </span>
                  <span className='shrink-0 text-right text-sm font-semibold tabular-nums text-foreground'>
                    {indicator.value ?? NOT_YET_REPORTED}
                  </span>
                </>
              );

              return (
                <li key={indicator.code}>
                  {indicator.href ? (
                    <Link
                      href={indicator.href}
                      aria-label={`Open indicator ${indicator.code}: ${indicator.fullTitle}`}
                      className={`${rowClass} outline-none transition-colors hover:bg-muted/50 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background`}
                    >
                      {rowContent}
                    </Link>
                  ) : (
                    <div className={rowClass}>{rowContent}</div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
        <div className='border-t border-border/60 pt-3'>
          <button
            type='button'
            aria-expanded={indicatorsOpen}
            aria-controls={indicatorPanelId}
            aria-label={`${indicatorsOpen ? 'Hide' : 'Show'} contributing indicators for ${title}`}
            onClick={() => setIndicatorsOpen((open) => !open)}
            className='-mx-1 flex w-fit items-center gap-1.5 rounded-md px-1 py-0.5 text-xs font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'
          >
            <span>Indicators</span>
            <ChevronDownIcon
              className={`h-3.5 w-3.5 shrink-0 transition-transform ${indicatorsOpen ? 'rotate-180' : ''}`}
              aria-hidden
            />
          </button>
        </div>
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
        <p className='text-[10px] font-medium uppercase tracking-wide text-muted-foreground/70'>
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
          All-time totals from valid indicator updates across active projects.
          Expand a card to see the contributing indicators.
        </p>
      </header>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        {ENGAGEMENT_INDICATORS.map((ind) => {
          const rolls = ind.codes.map((code) => data?.indicators[code]);
          const indicatorBreakdown = ind.codes.map((code) => {
            const rollup = data?.indicators[code];

            return {
              code,
              label: conciseIndicatorLabel(
                code,
                rollup?.indicator_title ?? `Indicator ${code}`,
              ),
              fullTitle: rollup?.indicator_title ?? `Indicator ${code}`,
              value: formatEngagementValue([rollup]),
              href: indicatorHref(code, toIso),
            };
          });

          return (
            <EngagementMetricCard
              key={ind.codes.join('+')}
              title={ind.label}
              hint={ind.hint}
              value={formatEngagementValue(rolls)}
              unitLabel={ind.unitLabel}
              href={metricHref(ind.codes, toIso)}
              indicatorBreakdown={indicatorBreakdown}
              isLoading={isLoading}
            />
          );
        })}
      </div>
    </section>
  );
}
