'use server';

import { ProjectMetadata } from '@/_lib/types';
import { createClient } from '@/_utils/supabase/server';

export default async function ProjectMetadataServerAction(
  values: ProjectMetadata
) {
  const { users, impacts, outcomes, ...update } = values;

  const supabase = createClient();

  const result = await supabase
    .from('projects')
    .upsert(update, { onConflict: 'id' })
    .select();

  return result;
}
