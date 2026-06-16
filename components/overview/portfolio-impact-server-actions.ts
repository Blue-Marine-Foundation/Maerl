'use server';

import { cache } from 'react';
import { createClient } from '@/utils/supabase/server';
import type { Update } from '@/utils/types';
import { fetchUserAssignedProjectIds } from './user-project-assignments';

const TARGET_COUNT = 3;
const MIN_DESCRIPTION_LENGTH = 80;

const UPDATE_SELECT =
  '*, projects(name, slug, project_type), impact_indicators(indicator_code, indicator_unit, indicator_title)';

export type PortfolioImpactStats = {
  assignedProjectCount: number;
  activeProjectCount: number;
  validUpdateCount: number;
  indicatorCount: number;
};

export type PortfolioImpactData =
  | {
      variant: 'reviewer';
      stats: null;
      updates: [];
    }
  | {
      variant: 'unassigned';
      stats: null;
      updates: [];
    }
  | {
      variant: 'portfolio';
      stats: PortfolioImpactStats;
      updates: Update[];
    };

type ProjectAssignmentRow = {
  id: number;
  project_status: string | null;
};

function statsFromProjects(
  rows: readonly ProjectAssignmentRow[],
): Pick<
  PortfolioImpactStats,
  'assignedProjectCount' | 'activeProjectCount'
> {
  return {
    assignedProjectCount: rows.length,
    activeProjectCount: rows.filter((p) =>
      p.project_status?.toLowerCase().startsWith('active'),
    ).length,
  };
}

async function fetchPortfolioStats(
  supabase: Awaited<ReturnType<typeof createClient>>,
  projects: readonly ProjectAssignmentRow[],
): Promise<PortfolioImpactStats> {
  const base = statsFromProjects(projects);
  const projectIds = projects.map((p) => p.id);

  if (projectIds.length === 0) {
    return { ...base, validUpdateCount: 0, indicatorCount: 0 };
  }

  const [updatesRes, indicatorRowsRes] = await Promise.all([
    supabase
      .from('updates')
      .select('id', { count: 'exact', head: true })
      .in('project_id', [...projectIds])
      .eq('valid', true)
      .eq('duplicate', false),
    supabase
      .from('updates')
      .select('impact_indicator_id')
      .in('project_id', [...projectIds])
      .eq('valid', true)
      .eq('duplicate', false)
      .not('impact_indicator_id', 'is', null),
  ]);

  if (updatesRes.error) {
    throw new Error(
      `Failed to count portfolio updates: ${updatesRes.error.message}`,
    );
  }
  if (indicatorRowsRes.error) {
    throw new Error(
      `Failed to count portfolio indicators: ${indicatorRowsRes.error.message}`,
    );
  }

  const indicatorCount = new Set(
    (indicatorRowsRes.data ?? [])
      .map((r) => r.impact_indicator_id)
      .filter((id): id is number => typeof id === 'number'),
  ).size;

  return {
    ...base,
    validUpdateCount: updatesRes.count ?? 0,
    indicatorCount,
  };
}

async function fetchPortfolioHighlightUpdates(
  supabase: Awaited<ReturnType<typeof createClient>>,
  projectIds: readonly number[],
): Promise<Update[]> {
  if (projectIds.length === 0) return [];

  const base = () =>
    supabase
      .from('updates')
      .select(UPDATE_SELECT)
      .in('project_id', [...projectIds])
      .eq('valid', true)
      .eq('duplicate', false)
      .not('value', 'is', null)
      .not('description', 'is', null);

  const { data: strict, error: strictError } = await base()
    .eq('admin_reviewed', true)
    .not('link', 'is', null)
    .order('date', { ascending: false, nullsFirst: false })
    .limit(TARGET_COUNT * 2);

  if (strictError) {
    throw new Error(`Failed to load portfolio highlights: ${strictError.message}`);
  }

  const filteredStrict = (strict ?? []).filter(
    (u) => (u.description?.length ?? 0) >= MIN_DESCRIPTION_LENGTH,
  );

  if (filteredStrict.length >= TARGET_COUNT) {
    return filteredStrict.slice(0, TARGET_COUNT) as Update[];
  }

  const seen = new Set(filteredStrict.map((u) => u.id));
  const need = TARGET_COUNT - filteredStrict.length;

  const { data: relaxed, error: relaxedError } = await base()
    .not('link', 'is', null)
    .order('date', { ascending: false, nullsFirst: false })
    .limit(need * 4);

  if (relaxedError) {
    const highlighted = filteredStrict as Update[];
    return highlighted.length > 0
      ? highlighted
      : fetchRecentPortfolioUpdates(supabase, projectIds);
  }

  const filteredRelaxed = (relaxed ?? []).filter(
    (u) =>
      !seen.has(u.id) &&
      (u.description?.length ?? 0) >= MIN_DESCRIPTION_LENGTH,
  );

  const highlighted = [
    ...filteredStrict,
    ...filteredRelaxed.slice(0, need),
  ] as Update[];

  if (highlighted.length > 0) {
    return highlighted;
  }

  return fetchRecentPortfolioUpdates(supabase, projectIds);
}

async function fetchRecentPortfolioUpdates(
  supabase: Awaited<ReturnType<typeof createClient>>,
  projectIds: readonly number[],
): Promise<Update[]> {
  if (projectIds.length === 0) return [];

  const { data, error } = await supabase
    .from('updates')
    .select(UPDATE_SELECT)
    .in('project_id', [...projectIds])
    .eq('valid', true)
    .eq('duplicate', false)
    .order('date', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false, nullsFirst: false })
    .limit(TARGET_COUNT);

  if (error) {
    throw new Error(`Failed to load recent portfolio updates: ${error.message}`);
  }

  return (data ?? []) as Update[];
}

export const fetchPortfolioImpact = cache(async (): Promise<PortfolioImpactData> => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { variant: 'unassigned', stats: null, updates: [] };
  }

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  if (profile?.role === 'Super Admin') {
    return { variant: 'reviewer', stats: null, updates: [] };
  }

  const projectIds = await fetchUserAssignedProjectIds();

  if (projectIds.length === 0) {
    return { variant: 'unassigned', stats: null, updates: [] };
  }

  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select('id, project_status')
    .in('id', projectIds);

  if (projectsError) {
    throw new Error(`Failed to load your projects: ${projectsError.message}`);
  }

  const assigned = (projects ?? []) as ProjectAssignmentRow[];

  const [stats, updates] = await Promise.all([
    fetchPortfolioStats(supabase, assigned),
    fetchPortfolioHighlightUpdates(supabase, projectIds),
  ]);

  return { variant: 'portfolio', stats, updates };
});
