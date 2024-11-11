'use server';

import { createClient } from '@/utils/supabase/server';
import type { ImpactIndicator } from '@/utils/types';

export const fetchImpactIndicators = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('impact_indicators')
    .select('*')
    .order('indicator_code');

  if (error) throw error;
  return data as ImpactIndicator[];
};
