'use server';

import { cache } from 'react';
import { createClient } from '@/utils/supabase/server';

type UserNameProfile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
};

function buildDisplayName(profile: UserNameProfile | null): string | null {
  if (!profile) return null;

  const name = [profile.first_name, profile.last_name]
    .filter(
      (part): part is string => typeof part === 'string' && part.trim().length > 0,
    )
    .join(' ')
    .trim();

  return name.length > 0 ? name : null;
}

function collectProjectIds(
  rows: readonly { id: unknown }[] | null | undefined,
  ids: Set<number>,
): void {
  for (const row of rows ?? []) {
    if (typeof row.id === 'number') {
      ids.add(row.id);
    }
  }
}

export const fetchUserAssignedProjectIds = cache(
  async (): Promise<number[]> => {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return [];
    }

    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('id, first_name, last_name')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError) {
      throw new Error(
        `Failed to load your profile for project assignments: ${profileError.message}`,
      );
    }

    const displayName = buildDisplayName(profile);
    const ids = new Set<number>();

    const [assignedRows, pmRows, supportRows] = await Promise.all([
      supabase
        .from('projects')
        .select('id, user_projects!inner(user_id)')
        .eq('user_projects.user_id', user.id),
      supabase
        .from('projects')
        .select('id, users!inner(id)')
        .eq('users.id', user.id),
      displayName
        ? supabase
            .from('projects')
            .select('id')
            .ilike('support', `%${displayName}%`)
        : Promise.resolve({ data: [], error: null }),
    ]);

    if (assignedRows.error) {
      throw new Error(
        `Failed to load your project assignments: ${assignedRows.error.message}`,
      );
    }
    if (pmRows.error) {
      throw new Error(
        `Failed to load your PM projects: ${pmRows.error.message}`,
      );
    }
    if (supportRows.error) {
      throw new Error(
        `Failed to load your support projects: ${supportRows.error.message}`,
      );
    }

    collectProjectIds(assignedRows.data, ids);
    collectProjectIds(pmRows.data, ids);
    collectProjectIds(supportRows.data, ids);

    return Array.from(ids);
  },
);
