'use server';

import { createClient } from '@/utils/supabase/server';

export const fetchLogframe = async (projectId: number) => {
  const supabase = await createClient();
  const response = await supabase
    .from('projects')
    .select('id, slug, name, impacts(*), outcomes(*), outputs(*)')
    .eq('id', projectId)
    .single();

  return response;
};
