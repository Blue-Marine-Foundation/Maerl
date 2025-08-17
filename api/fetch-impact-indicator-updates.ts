'use server';

import { createClient } from '@/utils/supabase/server';

export async function fetchImpactIndicatorUpdates(
  id: string,
  fromDate: string,
  toDate: string,
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('updates')
    .select(
      '*, projects(slug, name), output_measurables(*), impact_indicators(id, indicator_unit), users(*)',
    )
    .match({ impact_indicator_id: id, duplicate: false, valid: true })
    .gte('date', fromDate)
    .lte('date', toDate)
    .order('date', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
