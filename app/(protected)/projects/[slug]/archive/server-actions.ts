'use server';

import { createClient } from '@/utils/supabase/server';

export async function getArchivedOutputIndicators(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('output_measurables')
    .select('*, projects!inner(id, name, slug), outputs(*)')
    .eq('archived', true)
    .eq('projects.slug', slug);

  if (error) {
    throw error;
  }

  const flattenedData = data.map(({ projects, outputs, ...item }) => ({
    projectId: projects.id,
    projectName: projects.name,
    projectSlug: projects.slug,
    outputId: outputs.id,
    outputCode: outputs.code,
    outputDescription: outputs.description,
    ...item,
  }));

  return flattenedData;
}
