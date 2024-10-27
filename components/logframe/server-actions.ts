'use server';

import { createClient } from '@/utils/supabase/server';
import { Output } from '@/utils/types';

export const fetchOutputByCode = async (code: string, projectSlug: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('outputs')
    .select(
      `
      *,
      projects!inner(*),
      output_measurables(*)
    `,
    )
    .eq('projects.slug', projectSlug)
    .eq('code', `O.${code}`)
    .single();

  if (error) throw error;
  return data;
};
