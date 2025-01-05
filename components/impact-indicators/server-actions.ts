'use server';

import { createClient } from '@/utils/supabase/server';

export async function fetchImpactIndicators(fromDate: string, toDate: string) {
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
