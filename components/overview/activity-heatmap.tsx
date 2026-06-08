import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/utils/cn';
import { fetchActivityHeatmap } from './activity-heatmap-server-actions';
import {
  buildEmptyActivityHeatmapData,
  cellOpacity,
  getBusiestStretch,
  getIsoWeekStartDate,
  pluralizeUpdates,
  type ActivityHeatmapData,
  type ActivityHeatmapWeek,
} from './activity-heatmap-utils';

const MONTH_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

const monthFormatter = new Intl.DateTimeFormat('en-GB', {
  month: 'long',
  timeZone: 'UTC',
});

const lastUpdateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  timeZone: 'UTC',
});

type ActivityHeatmapContentProps = {
  data: ActivityHeatmapData;
  errorMessage?: string;
  peakBaseline?: number;
};

function weekTooltip(week: ActivityHeatmapWeek, isFuture: boolean): string {
  const dateLabel = dateFormatter.format(
    new Date(`${week.startDate}T00:00:00Z`),
  );

  if (isFuture) {
    return `Week of ${dateLabel}: not yet`;
  }

  return `Week of ${dateLabel}: ${pluralizeUpdates(week.count)}`;
}

function describeWeekRange(year: number, startWeek: number, endWeek: number) {
  const startDate = getIsoWeekStartDate(year, startWeek);
  const endDate = getIsoWeekStartDate(year, endWeek);
  const startMonth = monthFormatter.format(startDate);
  const endMonth = monthFormatter.format(endDate);

  return startMonth === endMonth ? startMonth : `${startMonth}-${endMonth}`;
}

function heatmapCopy(data: ActivityHeatmapData) {
  const pastWeeks = data.weeks.filter((week) => week.week <= data.currentWeek);
  const totalUpdates = pastWeeks.reduce((sum, week) => sum + week.count, 0);

  if (totalUpdates === 0) {
    return {
      totalUpdates,
      title: 'No updates yet this year',
      subtitle: "No updates yet this year - let's get going.",
    };
  }

  const lastUpdateWeek = pastWeeks.reduce(
    (lastWeek, week) => (week.count > 0 ? week.week : lastWeek),
    0,
  );
  const quietWeeks = Math.max(0, data.currentWeek - lastUpdateWeek);
  const busiest = getBusiestStretch(data.weeks, data.currentWeek);
  const quietCopy =
    quietWeeks === 0
      ? 'Updated this week.'
      : `${quietWeeks} quiet week${quietWeeks === 1 ? '' : 's'} since your last update.`;
  const busiestCopy =
    busiest && busiest.total > 0
      ? `Busiest stretch: ${describeWeekRange(
          data.year,
          busiest.startWeek,
          busiest.endWeek,
        )}. `
      : '';

  return {
    totalUpdates,
    title: `${pluralizeUpdates(totalUpdates)} so far this year`,
    subtitle: `${busiestCopy}${quietCopy}`,
  };
}

function footerLeftCopy(data: ActivityHeatmapData): string {
  if (!data.lastUpdateDate) return 'No updates yet';

  const date = new Date(data.lastUpdateDate);
  if (Number.isNaN(date.getTime())) return 'Last update date unknown';

  return `Last update: ${lastUpdateFormatter.format(date)}`;
}

function monthState(
  year: number,
  monthIndex: number,
): 'current' | 'future' | 'past' {
  const now = new Date();
  const currentYear = now.getUTCFullYear();

  if (year < currentYear) return 'past';
  if (year > currentYear) return 'future';
  if (monthIndex === now.getUTCMonth()) return 'current';
  if (monthIndex > now.getUTCMonth()) return 'future';
  return 'past';
}

function gridMetrics(weekCount: number) {
  return {
    gridTemplateColumns: `repeat(${weekCount}, minmax(8px, 1fr))`,
    minWidth: `${weekCount * 8 + Math.max(0, weekCount - 1) * 3}px`,
  };
}

function ActivityHeatmapContent({
  data,
  errorMessage,
  peakBaseline,
}: ActivityHeatmapContentProps) {
  const copy = heatmapCopy(data);
  const remainingWeeks = Math.max(0, data.weeks.length - data.currentWeek);
  const metrics = gridMetrics(data.weeks.length);
  const gridLabel = `Weekly update activity for ${data.year}: ${pluralizeUpdates(
    copy.totalUpdates,
  )} so far, ${remainingWeeks} weeks remaining.`;

  return (
    <section
      className='rounded-[10px] border-[0.5px] border-white/[0.08] bg-[#14191F] px-5 py-5 shadow-sm sm:px-7 sm:py-6'
      role='region'
      aria-labelledby='activity-heatmap-title'
    >
      <p className='mb-1.5 text-[11px] font-medium uppercase tracking-[0.04em] text-muted-foreground'>
        Your year in updates · {data.year}
      </p>
      <h2
        id='activity-heatmap-title'
        className='text-lg font-medium leading-snug text-foreground'
      >
        {copy.title}
      </h2>
      <p className='mt-1 text-sm leading-relaxed text-muted-foreground'>
        {errorMessage ?? copy.subtitle}
      </p>

      <div className='mt-5 overflow-x-auto pb-1 pt-0.5 [scrollbar-color:rgba(255,255,255,0.18)_transparent]'>
        <div
          className='grid gap-[3px]'
          style={metrics}
          role='img'
          aria-label={gridLabel}
        >
          {data.weeks.map((week) => {
            const isFuture = week.week > data.currentWeek;
            const isCurrent = week.week === data.currentWeek;
            const title = weekTooltip(week, isFuture);
            const cellLabel = isCurrent ? `${title} · this week` : title;

            return (
              <span
                key={week.week}
                className={cn(
                  'block aspect-square min-w-2 rounded-[2px]',
                  isFuture &&
                    'border-[0.5px] border-dashed border-white/[0.08] bg-white/[0.02]',
                  isCurrent &&
                    'outline outline-1 outline-offset-1 outline-white/30',
                )}
                style={
                  isFuture
                    ? undefined
                    : {
                        backgroundColor: `rgba(93, 202, 165, ${cellOpacity(
                          week.count,
                          peakBaseline,
                        )})`,
                      }
                }
                title={cellLabel}
                aria-label={cellLabel}
              />
            );
          })}
        </div>

        <div
          className='mt-2.5 grid grid-cols-12 gap-[3px] text-[11px] text-muted-foreground'
          style={{ minWidth: metrics.minWidth }}
          aria-hidden='true'
        >
          {MONTH_LABELS.map((label, index) => {
            const state = monthState(data.year, index);

            return (
              <span
                key={label}
                className={cn(
                  state === 'current' && 'font-medium text-foreground',
                  state === 'future' && 'opacity-50',
                )}
              >
                {label}
              </span>
            );
          })}
        </div>
      </div>

      <div className='mt-4 flex items-center justify-between border-t-[0.5px] border-white/[0.08] pt-3.5 text-xs'>
        <span className='text-foreground'>{footerLeftCopy(data)}</span>
        <span className='text-muted-foreground'>
          {remainingWeeks === 0
            ? 'Year complete'
            : `This week · ${remainingWeeks} week${
                remainingWeeks === 1 ? '' : 's'
              } remaining`}
        </span>
      </div>
    </section>
  );
}

export function ActivityHeatmapSkeleton() {
  const data = buildEmptyActivityHeatmapData();
  const metrics = gridMetrics(data.weeks.length);

  return (
    <section className='rounded-[10px] border-[0.5px] border-white/[0.08] bg-[#14191F] px-5 py-5 shadow-sm sm:px-7 sm:py-6'>
      <Skeleton className='mb-2 h-3 w-44 bg-muted/70' />
      <Skeleton className='h-6 w-64 bg-muted/70' />
      <Skeleton className='mt-2 h-4 w-full max-w-lg bg-muted/70' />

      <div className='mt-5 overflow-x-hidden'>
        <div className='grid gap-[3px]' style={metrics}>
          {data.weeks.map((week) => (
            <Skeleton
              key={week.week}
              className='aspect-square min-w-2 rounded-[2px] bg-muted/70'
            />
          ))}
        </div>
        <Skeleton className='mt-3 h-3 w-full bg-muted/60' />
      </div>

      <div className='mt-4 flex items-center justify-between border-t-[0.5px] border-white/[0.08] pt-3.5'>
        <Skeleton className='h-3 w-24 bg-muted/70' />
        <Skeleton className='h-3 w-40 bg-muted/70' />
      </div>
    </section>
  );
}

async function ActivityHeatmap() {
  try {
    const data = await fetchActivityHeatmap();
    return <ActivityHeatmapContent data={data} />;
  } catch (error) {
    console.error(error);

    return (
      <ActivityHeatmapContent
        data={buildEmptyActivityHeatmapData()}
        errorMessage="We couldn't load weekly update activity right now."
      />
    );
  }
}

export default function ActivityHeatmapWithSuspense() {
  return (
    <Suspense fallback={<ActivityHeatmapSkeleton />}>
      <ActivityHeatmap />
    </Suspense>
  );
}
