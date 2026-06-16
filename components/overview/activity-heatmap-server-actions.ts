'use server';

import { cache } from 'react';
import { createClient } from '@/utils/supabase/server';
import {
  buildEmptyActivityHeatmapData,
  getIsoWeekInfo,
  getIsoWeekStartDate,
  getIsoWeeksInYear,
  toIsoDate,
  type ActivityHeatmapData,
} from './activity-heatmap-utils';
import { fetchUserAssignedProjectIds } from './user-project-assignments';

type ActivityUpdateRow = {
  id: number;
  created_at: string | null;
};

function normaliseYear(year?: number): number {
  const fallback = new Date().getUTCFullYear();

  if (!year || !Number.isInteger(year) || year < 2000 || year > 2100) {
    return fallback;
  }

  return year;
}

export const fetchActivityHeatmap = cache(
  async (requestedYear?: number): Promise<ActivityHeatmapData> => {
    const year = normaliseYear(requestedYear);
    const empty = buildEmptyActivityHeatmapData(year);
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return empty;
    }

    const projectIds = await fetchUserAssignedProjectIds();

    if (projectIds.length === 0) {
      return empty;
    }

    const totalWeeks = getIsoWeeksInYear(year);
    const rangeStart = toIsoDate(getIsoWeekStartDate(year, 1));
    const rangeEnd = toIsoDate(getIsoWeekStartDate(year, totalWeeks + 1));

    const { data: updates, error: updatesError } = await supabase
      .from('updates')
      .select('id, created_at')
      .in('project_id', projectIds)
      .eq('valid', true)
      .eq('duplicate', false)
      .gte('created_at', rangeStart)
      .lt('created_at', rangeEnd);

    if (updatesError) {
      throw new Error(
        `Failed to load weekly update activity: ${updatesError.message}`,
      );
    }

    const countsByWeek = new Map<number, Set<number>>();
    let lastUpdateDate: string | null = null;
    let lastUpdateTime = 0;

    for (const update of (updates ?? []) as ActivityUpdateRow[]) {
      if (typeof update.id !== 'number' || !update.created_at) continue;

      const createdAt = new Date(update.created_at);
      if (Number.isNaN(createdAt.getTime())) continue;

      const { year: updateIsoYear, week } = getIsoWeekInfo(createdAt);
      if (updateIsoYear !== year || week < 1 || week > totalWeeks) continue;

      if (createdAt.getTime() > lastUpdateTime) {
        lastUpdateDate = update.created_at;
        lastUpdateTime = createdAt.getTime();
      }

      const updateIds = countsByWeek.get(week) ?? new Set<number>();
      updateIds.add(update.id);
      countsByWeek.set(week, updateIds);
    }

    return {
      ...empty,
      lastUpdateDate,
      weeks: empty.weeks.map((week) => ({
        ...week,
        count: countsByWeek.get(week.week)?.size ?? 0,
      })),
    };
  },
);
