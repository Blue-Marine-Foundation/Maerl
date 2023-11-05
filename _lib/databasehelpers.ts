import { createClient } from '@/_utils/supabase/server';

export async function getProjectList() {
  const supabase = createClient();

  const { data: projects, error } = await supabase.from('projects').select('*');

  if (error) {
    throw new Error(`Failed to fetch projects: ${error.message}`);
  }

  return projects;
}
