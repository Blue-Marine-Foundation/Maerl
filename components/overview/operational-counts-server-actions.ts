'use server';

import { createClient } from '@/utils/supabase/server';

export type OperationalCounts = {
  activeProjects: number;
  updatesThisMonth: number;
  indicatorsWithDataThisYear: number;
  monthStartIso: string;
  yearStartIso: string;
  todayIso: string;
};

function toIsoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export async function fetchOperationalCounts(): Promise<OperationalCounts> {
  const supabase = await createClient();

  const today = new Date();
  const todayIso = toIsoDate(today);
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const yearStart = new Date(today.getFullYear(), 0, 1);
  const monthStartIso = toIsoDate(monthStart);
  const yearStartIso = toIsoDate(yearStart);

  // The first two queries use head + count for a planner-only roundtrip.
  // The third needs the column data so we can dedupe distinct indicator ids
  // (Postgres count(distinct) isn't reachable directly via PostgREST).
  const [activeProjectsRes, updatesThisMonthRes, indicatorRowsThisYearRes] =
    await Promise.all([
      supabase
        .from('projects')
        .select('id', { count: 'exact', head: true })
        .ilike('project_status', 'Active%'),
      supabase
        .from('updates')
        .select('id', { count: 'exact', head: true })
        .eq('valid', true)
        .eq('duplicate', false)
        .gte('date', monthStartIso),
      supabase
        .from('updates')
        .select('impact_indicator_id')
        .eq('valid', true)
        .eq('duplicate', false)
        .gte('date', yearStartIso)
        .not('impact_indicator_id', 'is', null),
    ]);

  if (activeProjectsRes.error) {
    throw new Error(
      `Failed to load active projects: ${activeProjectsRes.error.message}`,
    );
  }
  if (updatesThisMonthRes.error) {
    throw new Error(
      `Failed to load updates-this-month: ${updatesThisMonthRes.error.message}`,
    );
  }
  if (indicatorRowsThisYearRes.error) {
    throw new Error(
      `Failed to load indicators-this-year: ${indicatorRowsThisYearRes.error.message}`,
    );
  }

  const indicatorsWithDataThisYear = new Set(
    (indicatorRowsThisYearRes.data ?? [])
      .map((r) => r.impact_indicator_id)
      .filter((id): id is number => typeof id === 'number'),
  ).size;

  return {
    activeProjects: activeProjectsRes.count ?? 0,
    updatesThisMonth: updatesThisMonthRes.count ?? 0,
    indicatorsWithDataThisYear,
    monthStartIso,
    yearStartIso,
    todayIso,
  };
}
