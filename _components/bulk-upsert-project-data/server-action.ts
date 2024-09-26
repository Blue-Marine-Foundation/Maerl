'use server'

import { ProjectMetadata } from '@/_lib/types'
import { createClient } from '@/_utils/supabase/server'

export default async function UpsertProjectData(values: ProjectMetadata[]) {
  const supabase = createClient()

  const result = await supabase
    .from('projects')
    .upsert(values, { onConflict: 'id' })
    .select()

  return result
}
