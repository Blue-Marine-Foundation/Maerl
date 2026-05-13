'use server';

import { createClient } from '@/utils/supabase/server';

export type YourProjectRow = {
  id: number;
  name: string | null;
  slug: string;
  project_status: string | null;
  last_updated: string | null;
  project_type: string | null;
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

  // Filter through the user_projects join so the panel matches the rest of
  // the app's notion of "yours" — RLS for Partners uses the same table,
  // and Admin / PM assignments are tracked here rather than via the
  // sparsely-populated `projects.project_manager_id` column.
  const { data, error } = await supabase
    .from('projects')
    .select(SELECT_FIELDS)
    .eq('user_projects.user_id', user.id)
    .order('last_updated', { ascending: false, nullsFirst: false })
    .limit(5);

  if (error) {
    throw new Error(`Failed to load your projects: ${error.message}`);
  }
  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    project_status: row.project_status,
    last_updated: row.last_updated,
    project_type: row.project_type,
  }));
}
