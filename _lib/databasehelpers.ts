import { supabase } from '@/_utils/supabase/servicerole';

export async function getProjectList() {
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*, outputs (*), updates (*)');

  if (error) {
    throw new Error(`Failed to fetch projects: ${error.message}`);
  }

  return projects;
}
