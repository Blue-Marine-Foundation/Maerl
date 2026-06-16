'use server';

import { createClient } from '@/utils/supabase/server';
import { fetchUserAssignedProjectIds } from '../overview/user-project-assignments';
import { getDefaultUpdateDateRange } from './update-date-range';

export type UpdateScope = 'all' | 'current-user' | 'assigned-projects';

export const fetchUpdates = async (
  dateRange?: {
    from: string;
    to: string;
  },
  projectId?: number,
  updateScope: UpdateScope = 'all',
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

  const shouldFilterToCurrentUser = updateScope === 'current-user';
  const shouldFilterToAssignedProjects =
    projectId === undefined &&
    (updateScope === 'assigned-projects' ||
      profileResult.data?.role !== 'Super Admin');
  const assignedProjectIds = shouldFilterToAssignedProjects
    ? await fetchUserAssignedProjectIds()
    : [];

  if (shouldFilterToAssignedProjects && assignedProjectIds.length === 0) {
    return [];
  }

  const defaultRange = getDefaultUpdateDateRange();

  const dates = {
    from: dateRange?.from || defaultRange.from,
    to: dateRange?.to || defaultRange.to,
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

  if (shouldFilterToAssignedProjects) {
    query = query.in('project_id', assignedProjectIds);
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
