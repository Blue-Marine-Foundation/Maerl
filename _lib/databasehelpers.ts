import { supabase } from '@/_utils/supabase/servicerole';
import { Project } from './types';

export async function getProjectList(): Promise<Project[]> {
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*, outputs (*), updates (*)');

  if (error) {
    throw new Error(`Failed to fetch projects: ${error.message}`);
  }

  return projects;
}
