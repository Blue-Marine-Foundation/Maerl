'use server';

import { createClient } from '@/utils/supabase/server';
import { Impact } from '@/utils/types';

export const fetchLogframe = async (identifier: number | string) => {
  const supabase = await createClient();
  const response = await supabase
    .from('projects')
    .select('id, slug, name, impacts(*), outcomes(*), outputs(*)')
    .eq(typeof identifier === 'number' ? 'id' : 'slug', identifier)
    .single();

  return response;
};

export const upsertImpact = async (impact: Partial<Impact>) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('impacts')
    .upsert(impact)
    .select()
    .single();

  if (error) throw error;
  return data;
};
