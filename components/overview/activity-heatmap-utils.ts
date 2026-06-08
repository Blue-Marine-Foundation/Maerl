export type ActivityHeatmapWeek = {
  week: number;
  startDate: string;
  count: number;
};

export type ActivityHeatmapData = {
  year: number;
  currentWeek: number;
  lastUpdateDate: string | null;
  weeks: ActivityHeatmapWeek[];
};

export type ActivityStretch = {
  startWeek: number;
  endWeek: number;
  total: number;
};

export const DEFAULT_PEAK_BASELINE = 8;

const MS_PER_DAY = 86_400_000;

export function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function toUtcDate(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}

export function getIsoWeekInfo(date: Date): { year: number; week: number } {
  const target = toUtcDate(date);
  const day = target.getUTCDay() || 7;

  target.setUTCDate(target.getUTCDate() + 4 - day);

  const year = target.getUTCFullYear();
  const yearStart = new Date(Date.UTC(year, 0, 1));
  const week = Math.ceil(
    ((target.getTime() - yearStart.getTime()) / MS_PER_DAY + 1) / 7,
  );

  return { year, week };
}

export function getIsoWeeksInYear(year: number): number {
  // 28 December is always in the final ISO week of its ISO year.
  return getIsoWeekInfo(new Date(Date.UTC(year, 11, 28))).week;
}

export function getIsoWeekStartDate(year: number, week: number): Date {
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const day = jan4.getUTCDay() || 7;
  const weekOneStart = new Date(jan4);

  weekOneStart.setUTCDate(jan4.getUTCDate() - day + 1);

  const startDate = new Date(weekOneStart);
  startDate.setUTCDate(weekOneStart.getUTCDate() + (week - 1) * 7);

  return startDate;
}

export function getDisplayCurrentWeek(year: number, now = new Date()): number {
  const totalWeeks = getIsoWeeksInYear(year);
  const current = getIsoWeekInfo(now);

  if (current.year < year) return 0;
  if (current.year > year) return totalWeeks;

  return Math.max(0, Math.min(totalWeeks, current.week));
}

export function buildEmptyActivityHeatmapData(
  year = new Date().getUTCFullYear(),
  now = new Date(),
): ActivityHeatmapData {
  const totalWeeks = getIsoWeeksInYear(year);

  return {
    year,
    currentWeek: getDisplayCurrentWeek(year, now),
    lastUpdateDate: null,
    weeks: Array.from({ length: totalWeeks }, (_, index) => {
      const week = index + 1;
      return {
        week,
        startDate: toIsoDate(getIsoWeekStartDate(year, week)),
        count: 0,
      };
    }),
  };
}

export function cellOpacity(
  count: number,
  peakBaseline = DEFAULT_PEAK_BASELINE,
): number {
  if (count === 0) return 0.05;
  return Math.min(1, 0.15 + (count / peakBaseline) * 0.85);
}

export function pluralizeUpdates(count: number): string {
  return `${count.toLocaleString()} update${count === 1 ? '' : 's'}`;
}

export function getBusiestStretch(
  weeks: readonly ActivityHeatmapWeek[],
  currentWeek: number,
  windowSize = 4,
): ActivityStretch | null {
  const pastWeeks = weeks.filter((week) => week.week <= currentWeek);
  const size = Math.min(windowSize, pastWeeks.length);

  if (size === 0) return null;

  let bestStart = pastWeeks[0]?.week ?? 1;
  let bestTotal = -1;

  for (let index = 0; index <= pastWeeks.length - size; index += 1) {
    const total = pastWeeks
      .slice(index, index + size)
      .reduce((sum, week) => sum + week.count, 0);

    if (total > bestTotal) {
      bestTotal = total;
      bestStart = pastWeeks[index].week;
    }
  }

  return {
    startWeek: bestStart,
    endWeek: bestStart + size - 1,
    total: bestTotal,
  };
}
