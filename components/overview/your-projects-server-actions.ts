'use server';

import { createClient } from '@/utils/supabase/server';

export type YourProjectRow = {
  id: number;
  name: string | null;
  slug: string;
  project_status: string | null;
  last_updated: string | null;
  project_type: string | null;
  /** Distinct impact indicators with valid updates on this project. */
  indicatorCount: number;
};

// Retained for the existing call sites; no longer drives behaviour.
// `user_projects` is the canonical source of truth for project assignment
// across every role (Admin, PM, Partner), so the query is the same in
// every case. Kept on the signature to avoid touching callers in this PR.
export type YourProjectsScope = 'pm' | 'partner';

const SELECT_FIELDS =
  'id, name, slug, project_status, last_updated, project_type, user_projects!inner(user_id)';

export async function fetchYourProjects(
  _scope: YourProjectsScope,
): Promise<YourProjectRow[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from('projects')
    .select(SELECT_FIELDS)
    .eq('user_projects.user_id', user.id)
    .order('last_updated', { ascending: false, nullsFirst: false })
    .limit(8);

  if (error) {
    throw new Error(`Failed to load your projects: ${error.message}`);
  }

  const projects = (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    project_status: row.project_status,
    last_updated: row.last_updated,
    project_type: row.project_type,
  }));

  const projectIds = projects.map((p) => p.id);
  if (projectIds.length === 0) return [];

  const { data: updateRows, error: updatesError } = await supabase
    .from('updates')
    .select('project_id, impact_indicator_id')
    .in('project_id', projectIds)
    .eq('valid', true)
    .eq('duplicate', false)
    .not('impact_indicator_id', 'is', null);

  if (updatesError) {
    throw new Error(
      `Failed to load project indicator counts: ${updatesError.message}`,
    );
  }

  const indicatorsByProject = new Map<number, Set<number>>();
  for (const row of updateRows ?? []) {
    if (
      typeof row.project_id !== 'number' ||
      typeof row.impact_indicator_id !== 'number'
    ) {
      continue;
    }
    const set =
      indicatorsByProject.get(row.project_id) ?? new Set<number>();
    set.add(row.impact_indicator_id);
    indicatorsByProject.set(row.project_id, set);
  }

  return projects.map((p) => ({
    ...p,
    indicatorCount: indicatorsByProject.get(p.id)?.size ?? 0,
  }));
}
