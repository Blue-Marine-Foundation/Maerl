'use server';

import { createClient } from '@/utils/supabase/server';
import { OutputMeasurable } from '@/utils/types';

export const fetchOutputByCode = async (code: string, projectSlug: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('outputs')
    .select(
      `
      *,
      projects!inner(*),
      output_measurables(*)
    `,
    )
    .eq('projects.slug', projectSlug)
    .eq('code', `O.${code}`)
    .single();

  if (error) throw error;
  return data;
};

export const fetchImpactIndicators = async (projectId: number) => {
  const supabase = await createClient();
  const { data, error } = await supabase.from('impact_indicators').select('*');

  if (error) throw error;
  return data;
};

export const upsertOutputMeasurable = async (
  measurable: Partial<OutputMeasurable>,
) => {
  const supabase = await createClient();

  if (!measurable.output_id || !measurable.description) {
    throw new Error('Missing required fields');
  }

  const { data, error } = await supabase
    .from('output_measurables')
    .upsert({
      id: measurable.id,
      project_id: measurable.project_id,
      output_id: measurable.output_id,
      code: measurable.code,
      description: measurable.description,
      impact_indicator_id: measurable.impact_indicator_id,
      target: measurable.target,
      verification: measurable.verification || '',
      assumptions: measurable.assumptions || '',
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};
