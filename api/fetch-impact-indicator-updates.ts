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
      '*, projects(id, slug, name), output_measurables(*), outcome_measurables(*), impact_indicators(*), users(*)',
    )
    .eq('impact_indicator_id', id)
    .eq('valid', true)
    .eq('duplicate', false)
    .or(
      'type.eq.Progress,and(type.eq.Impact,admin_reviewed.eq.true,value.not.is.null)',
    )
    .gte('date::date', toServerDateString(fromDate))
    .lte('date::date', toServerDateString(toDate))
    .order('date', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
