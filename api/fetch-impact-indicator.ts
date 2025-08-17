import { createClient } from '@/utils/supabase/server';

export async function fetchImpactIndicator(id: string) {
  const supabase = await createClient();
  const response = await supabase
    .from('impact_indicators')
    .select('*')
    .eq('id', id)
    .single();

  return response;
}
