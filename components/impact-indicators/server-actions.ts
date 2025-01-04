'use server';

import { createClient } from '@/utils/supabase/server';

export async function fetchImpactIndicators() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('impact_indicator_summaries')
    .select('*')
    .order('impact_indicator_id', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
