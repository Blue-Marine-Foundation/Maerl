'use server';

import { createClient } from '@/utils/supabase/server';
import { toServerDateString } from '@/utils/date-utils';

export async function fetchImpactIndicatorUpdates(
  id: string,
  fromDate: string,
  toDate: string,
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('updates')
    .select(
      '*, projects(slug, name), output_measurables(*), outcome_measurables(*), impact_indicators(*), users(*)',
    )
    .eq('impact_indicator_id', id)
    .gte('date::date', toServerDateString(fromDate))
    .lte('date::date', toServerDateString(toDate))
    .order('date', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
