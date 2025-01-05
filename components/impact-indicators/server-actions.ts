'use server';

import { createClient } from '@/utils/supabase/server';

export async function fetchImpactIndicators() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('impact_indicators')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function fetchImpactIndicatorSummaries(
  fromDate: string,
  toDate: string,
) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('get_impact_indicator_summaries', {
    from_date: fromDate,
    to_date: toDate,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

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
    .match({ impact_indicator_id: id, original: true, valid: true })
    .gte('date', fromDate)
    .lte('date', toDate)
    .order('date', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
