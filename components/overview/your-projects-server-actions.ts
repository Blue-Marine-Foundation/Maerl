'use server';

import { createClient } from '@/utils/supabase/server';
import { fetchUserAssignedProjectIds } from './user-project-assignments';

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
// Project assignment comes from stable project relationships only.
export type YourProjectsScope = 'pm' | 'partner';

const SELECT_FIELDS =
  'id, name, slug, project_status, last_updated, project_type';

export async function fetchYourProjects(
  _scope: YourProjectsScope,
): Promise<YourProjectRow[]> {
  const supabase = await createClient();
  const projectIds = await fetchUserAssignedProjectIds();

  if (projectIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from('projects')
    .select(SELECT_FIELDS)
    .in('id', projectIds)
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

  if (projects.length === 0) return [];

  const { data: updateRows, error: updatesError } = await supabase
    .from('updates')
    .select('project_id, impact_indicator_id')
    .in('project_id', projects.map((p) => p.id))
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
