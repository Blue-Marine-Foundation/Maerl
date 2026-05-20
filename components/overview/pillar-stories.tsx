'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import * as d3 from 'd3';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/utils/cn';
import {
  ALL_TIME_FROM_DATE,
  FISHERIES_INDICATORS,
  INDICATOR_IDS,
  PROTECTION_SEGMENTS,
  RESTORATION_INDICATORS,
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

function formatAreaKm2(value: number): string | null {
  if (value <= 0) return null;
  if (value >= 1_000_000) {
    return `${d3.format('.2f')(value / 1_000_000)}M km²`;
  }
  return `${d3.format(',.0f')(value)} km²`;
}

function formatCountValue(value: number): string | null {
  if (value <= 0) return null;
  return d3.format(',.0f')(value);
}

function formatMetricValue(
  rollup: IndicatorRollup | undefined,
): string | null {
  if (!rollup || rollup.total_value <= 0) return null;
  const u = rollup.indicator_unit.toLowerCase();
  if (u.includes('km')) return formatAreaKm2(rollup.total_value);
  return formatCountValue(rollup.total_value);
}

function useOverviewData() {
  return useQuery<PillarStoriesData>({
    queryKey: ['impact-pillar-stories', 'org-wide'],
    queryFn: fetchPillarStoriesData,
    staleTime: 10 * 60 * 1000,
  });
}

function PillarCardShell({
  number,
  title,
  description,
  children,
  isLoading,
}: Readonly<{
  number: string;
  title: string;
  description: string;
  children: ReactNode;
  isLoading: boolean;
}>) {
  return (
    <article className='flex h-full flex-col rounded-xl border border-border/80 bg-card p-6 shadow-sm'>
      <header className='mb-5'>
        <p className='text-xs font-medium tabular-nums text-muted-foreground'>
          {number}
        </p>
        <h3 className='mt-1 text-xl font-semibold tracking-tight'>{title}</h3>
        <p className='mt-1.5 text-sm leading-snug text-muted-foreground'>
          {description}
        </p>
      </header>
      {isLoading ? (
        <div className='flex flex-1 flex-col gap-3'>
          <Skeleton className='h-5 w-full' />
          <Skeleton className='h-5 w-full' />
          <Skeleton className='h-5 w-full' />
          <Skeleton className='mt-auto h-2 w-full rounded-full' />
        </div>
      ) : (
        children
      )}
    </article>
  );
}

function MetricRow({
  label,
  value,
  href,
  dotClass,
}: Readonly<{
  label: string;
  value: string | null;
  href: string | null;
  dotClass?: string;
}>) {
  const valueNode =
    value === null ? (
      <span className='text-sm text-muted-foreground'>{NOT_YET_REPORTED}</span>
    ) : (
      <span className='text-sm font-semibold tabular-nums text-foreground'>
        {value}
      </span>
    );

  return (
    <li className='flex items-center justify-between gap-4 py-2.5 first:pt-0 last:pb-0'>
      <span className='flex min-w-0 items-center gap-2.5 text-sm text-muted-foreground'>
        {dotClass ? (
          <span
            className={cn('h-2.5 w-2.5 shrink-0 rounded-full', dotClass)}
            aria-hidden
          />
        ) : null}
        <span className='leading-snug'>{label}</span>
      </span>
      {href && value !== null ? (
        <Link
          href={href}
          className='shrink-0 hover:text-sky-600 hover:underline dark:hover:text-sky-400'
        >
          {valueNode}
        </Link>
      ) : (
        <span className='shrink-0 text-right'>{valueNode}</span>
      )}
    </li>
  );
}

function ProtectionCard({
  data,
  isLoading,
  toIso,
}: Readonly<{
  data: PillarStoriesData | undefined;
  isLoading: boolean;
  toIso: string | null;
}>) {
  const rolls = PROTECTION_SEGMENTS.map((s) => data?.indicators[s.code]);
  const totals = rolls.map((r) => r?.total_value ?? 0);
  const sum = totals.reduce((a, b) => a + b, 0);

  return (
    <PillarCardShell
      number='01'
      title='Protection'
      description='Marine area in MPAs or no-take zones.'
      isLoading={isLoading}
    >
      <ul className='flex flex-col divide-y divide-border/60'>
        {PROTECTION_SEGMENTS.map((seg, i) => (
          <MetricRow
            key={seg.code}
            label={seg.shortLabel}
            value={formatAreaKm2(totals[i] ?? 0)}
            href={indicatorHref(seg.code, toIso)}
            dotClass={seg.dotClass}
          />
        ))}
      </ul>
      <div className='mt-6 flex flex-col gap-2'>
        <div
          className='flex h-2 w-full overflow-hidden rounded-full bg-muted'
          role='img'
          aria-label='Relative share across protection stages'
        >
          {sum > 0 ? (
            PROTECTION_SEGMENTS.map((seg, i) => {
              const t = totals[i] ?? 0;
              return (
                <div
                  key={seg.code}
                  className={cn('h-full min-w-0', seg.barClass)}
                  style={{ flex: `${Math.max(t, 0)} 1 0%` }}
                  title={`${seg.shortLabel}: ${formatAreaKm2(t) ?? NOT_YET_REPORTED}`}
                />
              );
            })
          ) : null}
        </div>
        <p className='text-center text-xs text-muted-foreground'>
          Relative share across stages
        </p>
      </div>
    </PillarCardShell>
  );
}

function PillarMetricsCard({
  number,
  title,
  description,
  indicators,
  rolls,
  isLoading,
  toIso,
}: Readonly<{
  number: string;
  title: string;
  description: string;
  indicators: readonly { code: string; label: string }[];
  rolls: (IndicatorRollup | undefined)[];
  isLoading: boolean;
  toIso: string | null;
}>) {
  return (
    <PillarCardShell
      number={number}
      title={title}
      description={description}
      isLoading={isLoading}
    >
      <ul className='flex flex-col divide-y divide-border/60'>
        {indicators.map((ind, i) => (
          <MetricRow
            key={ind.code}
            label={ind.label}
            value={formatMetricValue(rolls[i])}
            href={indicatorHref(ind.code, toIso)}
          />
        ))}
      </ul>
    </PillarCardShell>
  );
}

export default function PillarStories() {
  const { data, isLoading, error } = useOverviewData();

  if (error) {
    return (
      <p className='text-sm text-muted-foreground'>
        Failed to load pillar overview: {(error as Error).message}
      </p>
    );
  }

  const toIso = data?.todayIso ?? null;
  const restRolls = RESTORATION_INDICATORS.map((i) => data?.indicators[i.code]);
  const fishRolls = FISHERIES_INDICATORS.map((i) => data?.indicators[i.code]);

  return (
    <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
      <ProtectionCard data={data} isLoading={isLoading} toIso={toIso} />
      <PillarMetricsCard
        number='02'
        title='Restoration'
        description='Where habitat is being restored, recovering, or stocked.'
        indicators={RESTORATION_INDICATORS}
        rolls={restRolls}
        isLoading={isLoading}
        toIso={toIso}
      />
      <PillarMetricsCard
        number='03'
        title='Sustainable fisheries & threats'
        description='Reducing harmful fishing and supporting fishery management.'
        indicators={FISHERIES_INDICATORS}
        rolls={fishRolls}
        isLoading={isLoading}
        toIso={toIso}
      />
    </div>
  );
}
