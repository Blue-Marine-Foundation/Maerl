'use server';

import { approvedImpactFilters } from '@/utils/update-review';
import { createClient } from '@/utils/supabase/server';
import { toServerDateString } from '@/utils/date-utils';

export const fetchProjectImpactUpdates = async (
  dateRange: { from: string; to: string },
  projectSlug: string,
) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('updates')
    .select(
      '*, projects!inner(*), output_measurables(*), outcome_measurables(*), impact_indicators!inner(*), users(*)',
    )
    .gte('date::date', toServerDateString(dateRange.from))
    .lte('date::date', toServerDateString(dateRange.to))
    .eq('type', 'Impact')
    .eq('projects.slug', projectSlug)
    .match({ ...approvedImpactFilters })
    .order('date', { ascending: false });

  if (error) {
    throw error;
  }

  return data;
};
