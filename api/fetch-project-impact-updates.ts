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
      '*, projects(*), output_measurables(*), impact_indicators(*), users(*)',
    )
    .gte('date', dateRange.from)
    .lte('date', dateRange.to)
    .eq('type', 'Impact')
    .eq('projects.slug', projectSlug)
    .order('date', { ascending: false });

  if (error) {
    throw error;
  }

  return data;
};
