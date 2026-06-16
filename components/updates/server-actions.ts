'use server';

import { createClient } from '@/utils/supabase/server';
import { endOfDay, startOfMonth } from 'date-fns';

export type UpdateAuthorScope = 'all' | 'current-user';

export const fetchUpdates = async (
  dateRange?: {
    from: string;
    to: string;
  },
  projectId?: number,
  authorScope: UpdateAuthorScope = 'all',
) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const profileResult =
    projectId === undefined
      ? await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .maybeSingle()
      : { data: null, error: null };

  if (profileResult.error) {
    throw new Error(
      `Failed to load your update permissions: ${profileResult.error.message}`,
    );
  }

  const shouldFilterToCurrentUser =
    authorScope === 'current-user' ||
    (projectId === undefined && profileResult.data?.role !== 'Super Admin');

  // Set default date range if not provided
  const today = new Date();
  const defaultFrom = startOfMonth(today);
  const defaultTo = endOfDay(today);

  const dates = {
    from: dateRange?.from || defaultFrom.toISOString(),
    to: dateRange?.to || defaultTo.toISOString(),
  };

  let query = supabase
    .from('updates')
    .select(
      '*, projects(name, slug), output_measurables(*), impact_indicators(*), users(*)',
    )
    .gte('date::date', dates.from)
    .lte('date::date', dates.to)
    .match({
      ...(projectId ? { project_id: projectId } : {}),
      valid: true,
      duplicate: false,
    })
    .order('date', { ascending: false });

  if (shouldFilterToCurrentUser) {
    query = query.eq('posted_by', user.id);
  }

  const { data, error } = await query;

  if (error) throw error;

  return data;
};

export const fetchOutputUpdates = async (outputId: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('updates')
    .select(
      '*, projects(name, slug), output_measurables!inner(*), impact_indicators(*)',
    )
    .eq('output_measurables.output_id', outputId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};
