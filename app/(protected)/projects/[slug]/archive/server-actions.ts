'use server';

import { createClient } from '@/utils/supabase/server';

export async function getArchivedOutputIndicators(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('output_measurables')
    .select('*, projects!inner(slug)')
    .eq('archived', true)
    .eq('projects.slug', slug);

  if (error) {
    throw error;
  }

  return data;
}
