'use server';

import { createClient } from '@/utils/supabase/server';
import { ProjectMetadata } from '@/utils/types';

export async function fetchProjectMetadata(
  projectId: number,
): Promise<ProjectMetadata> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('projects')
    .select('*, users(first_name, last_name)')
    .eq('id', projectId)
    .single();

  if (error || !data) {
    throw error || new Error('Project not found');
  }

  const pm = data.users
    ? `${data.users.first_name} ${data.users.last_name}`.trim()
    : null;

  const flatProject: ProjectMetadata = { ...data, pm };

  return flatProject;
}
