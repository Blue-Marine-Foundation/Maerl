'use server';

import { cache } from 'react';
import { createClient } from '@/utils/supabase/server';

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

    const ids = new Set<number>();

    const [assignedRows, pmRows] = await Promise.all([
      supabase
        .from('projects')
        .select('id, user_projects!inner(user_id)')
        .eq('user_projects.user_id', user.id),
      supabase
        .from('projects')
        .select('id, users!inner(id)')
        .eq('users.id', user.id),
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

    collectProjectIds(assignedRows.data, ids);
    collectProjectIds(pmRows.data, ids);

    return Array.from(ids);
  },
);
