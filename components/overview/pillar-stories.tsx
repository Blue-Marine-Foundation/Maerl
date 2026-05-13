'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import * as d3 from 'd3';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/utils/cn';
import {
  ALL_TIME_FROM_DATE,
  ENGAGEMENT_INDICATORS,
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

function indicatorHref(code: string, toIso: string | null): string | null {
  const id = INDICATOR_IDS[code];
  if (id === undefined || !toIso) return null;
  return `/impactindicators/${id}?from=${ALL_TIME_FROM_DATE}&to=${toIso}`;
}

function formatAreaKm2(value: number): string {
  if (value <= 0) return '—';
  if (value >= 1_000_000) {
    return `${d3.format('.2f')(value / 1_000_000)}M km²`;
  }
  return `${d3.format(',.0f')(value)} km²`;
}

function formatRollupValue(rollup: IndicatorRollup | undefined): string {
  if (!rollup || rollup.total_value <= 0) return '—';
  const u = rollup.indicator_unit.toLowerCase();
  if (u.includes('km')) return formatAreaKm2(rollup.total_value);
  return d3.format(',.0f')(rollup.total_value);
}

/** UI copy for counts so we are not tied to awkward `indicator_unit` text in the DB. */
const COUNT_METRIC_DISPLAY_UNIT: Record<string, string> = {
  '2.2.4': 'specimens',
  '4.3.2': 'instruments',
  '5.6.1': 'people',
  '5.2.1': 'beneficiaries',
  '5.2.2': 'beneficiaries',
  '5.3.3': 'people',
};

function formatRollupUnit(
  rollup: IndicatorRollup | undefined,
  indicatorCode?: string,
): string {
  if (!rollup) return '';
  const u = rollup.indicator_unit.toLowerCase();
  if (u.includes('km')) return '';
  if (indicatorCode && COUNT_METRIC_DISPLAY_UNIT[indicatorCode]) {
    return COUNT_METRIC_DISPLAY_UNIT[indicatorCode];
  }
  return rollup.indicator_unit;
}

function useOverviewData() {
  return useQuery<PillarStoriesData>({
    queryKey: ['overview-pillar-stories'],
    queryFn: fetchPillarStoriesData,
    staleTime: 10 * 60 * 1000,
  });
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
    <div className='flex flex-col gap-3 rounded-lg border bg-card p-5'>
      <div className='flex flex-wrap items-baseline justify-between gap-2'>
        <div>
          <span className='text-[10px] font-medium uppercase tracking-wide text-muted-foreground'>
            Strategic pillar 1
          </span>
          <p className='text-sm font-semibold'>Protection</p>
          <p className='mt-1 text-xs text-muted-foreground'>
            Marine area in MPAs or no-take zones: new commitments, proposals, and
            designations (km² reported on your projects).
          </p>
        </div>
      </div>

      {isLoading && <Skeleton className='h-10 w-full rounded-md' />}
      {!isLoading && sum <= 0 && (
        <p className='text-sm text-muted-foreground'>
          No valid protection-area indicators yet on your assigned active
          projects — add updates for committed, proposed, or designated area.
        </p>
      )}
      {!isLoading && sum > 0 && (
        <>
          <div className='flex h-10 w-full overflow-hidden rounded-md text-xs font-semibold text-white'>
            {PROTECTION_SEGMENTS.map((seg, i) => {
              const t = totals[i] ?? 0;
              const label = formatAreaKm2(t);
              const flexGrow = Math.max(t, 0);
              return (
                <div
                  key={seg.code}
                  className={cn(
                    'flex min-w-0 items-center justify-center px-1',
                    seg.barClass,
                  )}
                  style={{ flex: `${flexGrow} 1 0%` }}
                  title={`${seg.shortLabel}: ${label}`}
                >
                  <span className='truncate tabular-nums'>{label}</span>
                </div>
              );
            })}
          </div>
          <ul className='flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground'>
            {PROTECTION_SEGMENTS.map((seg, i) => {
              const href = indicatorHref(seg.code, toIso);
              const roll = rolls[i];
              const line = (
                <span className='inline-flex items-center gap-1.5'>
                  <span
                    className={cn('inline-block h-2 w-2 rounded-sm', seg.barClass)}
                  />
                  {seg.shortLabel}: {formatAreaKm2(roll?.total_value ?? 0)}
                </span>
              );
              return (
                <li key={seg.code}>
                  {href ? (
                    <Link
                      href={href}
                      className='hover:text-foreground hover:underline'
                    >
                      {line}
                    </Link>
                  ) : (
                    line
                  )}
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}

function PillarMetricList({
  title,
  pillarLabel,
  subtitle,
  indicators,
  rolls,
  isLoading,
  toIso,
}: Readonly<{
  title: string;
  pillarLabel: string;
  subtitle: string;
  indicators: readonly { code: string; label: string }[];
  rolls: (IndicatorRollup | undefined)[];
  isLoading: boolean;
  toIso: string | null;
}>) {
  return (
    <div className='flex flex-col gap-3 rounded-lg border bg-card p-5'>
      <div>
        <span className='text-[10px] font-medium uppercase tracking-wide text-muted-foreground'>
          {pillarLabel}
        </span>
        <p className='text-sm font-semibold'>{title}</p>
        <p className='mt-1 text-xs text-muted-foreground'>{subtitle}</p>
      </div>
      {isLoading ? (
        <div className='flex flex-col gap-2'>
          <Skeleton className='h-8 w-full' />
          <Skeleton className='h-8 w-full' />
        </div>
      ) : (
        <ul className='flex flex-col gap-2'>
          {indicators.map((ind, i) => {
            const roll = rolls[i];
            const href = indicatorHref(ind.code, toIso);
            const value = formatRollupValue(roll);
            const unit = formatRollupUnit(roll, ind.code);
            return (
              <li
                key={ind.code}
                className='flex items-baseline justify-between gap-3 text-xs'
              >
                <span className='text-muted-foreground'>{ind.label}</span>
                <span className='shrink-0 text-right tabular-nums'>
                  {href ? (
                    <Link
                      href={href}
                      className='font-semibold hover:text-sky-400 hover:underline'
                    >
                      {value}
                      {unit ? ` ${unit}` : ''}
                    </Link>
                  ) : (
                    <span className='font-semibold'>
                      {value}
                      {unit ? ` ${unit}` : ''}
                    </span>
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function EngagementStrip({
  data,
  isLoading,
  toIso,
}: Readonly<{
  data: PillarStoriesData | undefined;
  isLoading: boolean;
  toIso: string | null;
}>) {
  const rolls = ENGAGEMENT_INDICATORS.map((e) => data?.indicators[e.code]);

  return (
    <div className='flex flex-col gap-3 rounded-lg border bg-card p-5'>
      <div>
        <span className='text-[10px] font-medium uppercase tracking-wide text-muted-foreground'>
          Cross-cutting
        </span>
        <p className='text-sm font-semibold'>Benefits & engagement</p>
        <p className='mt-1 text-xs text-muted-foreground'>
          Who benefits from the work, and who went from hearing about it to
          taking part. Figures are totals of valid indicator updates across your
          assigned active projects — open a row to see history and methodology.
        </p>
      </div>
      {isLoading ? (
        <div className='grid grid-cols-1 gap-3 sm:grid-cols-3'>
          <Skeleton className='h-16 w-full' />
          <Skeleton className='h-16 w-full' />
          <Skeleton className='h-16 w-full' />
        </div>
      ) : (
        <div className='grid grid-cols-1 gap-3 sm:grid-cols-3'>
          {ENGAGEMENT_INDICATORS.map((ind, i) => {
            const roll = rolls[i];
            const href = indicatorHref(ind.code, toIso);
            const suffix = formatRollupUnit(roll, ind.code);
            return (
              <div
                key={ind.code}
                className='flex flex-col gap-2 rounded-md border border-border/60 bg-background/40 p-3'
              >
                <div className='flex flex-col gap-0.5'>
                  <p className='text-xs font-medium leading-tight'>
                    {ind.label}
                  </p>
                  <p className='text-[11px] leading-snug text-muted-foreground'>
                    {ind.hint}
                  </p>
                </div>
                <p className='text-lg font-bold tabular-nums'>
                  {href ? (
                    <Link href={href} className='hover:text-sky-400 hover:underline'>
                      {formatRollupValue(roll)}
                      {suffix ? ` ${suffix}` : ''}
                    </Link>
                  ) : (
                    <>
                      {formatRollupValue(roll)}
                      {suffix ? ` ${suffix}` : ''}
                    </>
                  )}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
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

  const emptyHint =
    !isLoading && (data?.projectCount ?? 0) === 0 ? (
      <p className='text-xs text-muted-foreground'>
        Assign yourself to active projects to see these totals for your
        portfolio.
      </p>
    ) : null;

  return (
    <div className='flex flex-col gap-6'>
      {emptyHint}
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
        <ProtectionCard data={data} isLoading={isLoading} toIso={toIso} />
        <PillarMetricList
          title='Restoration'
          pillarLabel='Strategic pillar 2'
          subtitle='Where habitat is being restored, recovering, or stocked.'
          indicators={RESTORATION_INDICATORS}
          rolls={restRolls}
          isLoading={isLoading}
          toIso={toIso}
        />
        <PillarMetricList
          title='Sustainable fisheries & threats'
          pillarLabel='Strategic pillar 3'
          subtitle='Reducing harmful fishing, influencing policy, and involving those who manage fisheries.'
          indicators={FISHERIES_INDICATORS}
          rolls={fishRolls}
          isLoading={isLoading}
          toIso={toIso}
        />
      </div>
      <EngagementStrip data={data} isLoading={isLoading} toIso={toIso} />
    </div>
  );
}
