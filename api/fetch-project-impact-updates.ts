'use server';

import { createClient } from '@/utils/supabase/server';

export const fetchProjectImpactUpdates = async (
  dateRange: { from: string; to: string },
  projectSlug: string,
) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('updates')
    .select(
      '*, projects!inner(*), output_measurables(*), impact_indicators!inner(*), users(*)',
    )
    .gte('date::date', dateRange.from)
    .lte('date::date', dateRange.to)
    .eq('type', 'Impact')
    .eq('projects.slug', projectSlug)
    .match({ duplicate: false, valid: true })
    .order('date', { ascending: false });

  if (error) {
    throw error;
  }

  return data;
};
