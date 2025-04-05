'use server';

import { createClient } from '@/utils/supabase/server';

export async function addUnitContribution(
  formData: {
    unit_id: number;
    output_measurable_id: number;
  }[],
) {
  const supabase = await createClient();

  // Try with just unit_id to test
  const response = await supabase.from('unit_contributions').upsert(formData, {
    onConflict: 'unit_id,output_measurable_id',
    ignoreDuplicates: true,
  });

  return response;
}
