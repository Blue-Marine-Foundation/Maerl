'use server';

import { createClient } from '@/utils/supabase/server';
import {
  Impact,
  Outcome,
  OutcomeMeasurable,
  Output,
  OutputMeasurable,
} from '@/utils/types';

export const fetchLogframe = async (identifier: number | string) => {
  const supabase = await createClient();
  const response = await supabase
    .from('projects')
    .select(
      'id, slug, name, impacts(*), outcomes(*, outcome_measurables(*, impact_indicators(*), outputs(*, output_measurables(*, impact_indicators(*)))))',
    )
    .eq(typeof identifier === 'number' ? 'id' : 'slug', identifier)
    .single();

  return response;
};

export const fetchTheoryOfChange = async (identifier: number | string) => {
  const supabase = await createClient();
  const response = await supabase
    .from('projects')
    .select('id, slug, name, impacts(*), outcomes(*), outputs(*)')
    .eq(typeof identifier === 'number' ? 'id' : 'slug', identifier)
    .single();

  return response;
};

export const fetchUnassignedOutputs = async (identifier: number | string) => {
  const supabase = await createClient();
  const response = await supabase
    .from('projects')
    .select(
      'id, slug, name,  outputs!inner(*, output_measurables(*, impact_indicators(*)))',
    )
    .eq(typeof identifier === 'number' ? 'id' : 'slug', identifier)
    .is('outputs.outcome_measurable_id', null)
    .single();

  return response;
};

export const fetchOutputById = async (id: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('outputs')
    .select(
      `
      *,
      projects!inner(*),
      output_measurables(*, impact_indicators(*))
    `,
    )
    .eq('id', id)
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

export const upsertImpact = async (impact: Partial<Impact>) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('impacts')
    .upsert(impact)
    .select()
    .single();

  if (error) throw error;

  const { data: updatedProject } = await supabase
    .from('projects')
    .update({ last_updated: new Date().toISOString() })
    .eq('id', impact.project_id)
    .select()
    .single();

  return data;
};

export const upsertOutcome = async (outcome: Partial<Outcome>) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('outcomes')
    .upsert({
      id: outcome.id,
      project_id: outcome.project_id,
      description: outcome.description,
      code: outcome.code,
    })
    .select()
    .single();

  if (error) throw error;

  // Handle outcome_measurables
  if (outcome.outcome_measurables) {
    const measurablesToUpsert = outcome.outcome_measurables.map(
      (measurable) => ({
        ...measurable,
        project_id: outcome.project_id,
        outcome_id: data.id,
      }),
    );

    const { error: measurablesError } = await supabase
      .from('outcome_measurables')
      .upsert(measurablesToUpsert);

    if (measurablesError) throw measurablesError;
  }

  const { data: updatedProject } = await supabase
    .from('projects')
    .update({ last_updated: new Date().toISOString() })
    .eq('id', outcome.project_id)
    .select()
    .single();

  return data;
};

export const upsertOutcomeMeasurable = async (
  measurable: Partial<OutcomeMeasurable>,
) => {
  const supabase = await createClient();

  // Ensure we have required fields
  if (!measurable.outcome_id || !measurable.description || !measurable.code) {
    throw new Error('Missing required fields');
  }

  const { data, error } = await supabase
    .from('outcome_measurables')
    .upsert({
      id: measurable.id,
      project_id: measurable.project_id,
      outcome_id: measurable.outcome_id,
      description: measurable.description,
      verification: measurable.verification || '',
      assumptions: measurable.assumptions || '',
      code: measurable.code,
      target: measurable.target,
      impact_indicator_id: measurable.impact_indicator_id,
    })
    .select()
    .single();

  if (error) throw error;

  const { data: updatedProject } = await supabase
    .from('projects')
    .update({ last_updated: new Date().toISOString() })
    .eq('id', measurable.project_id)
    .select()
    .single();

  return data;
};

type UpsertOutputResponse = {
  success: boolean;
  data?: Output;
  error?: string;
};

export const upsertOutput = async (
  output: Partial<Output>,
): Promise<UpsertOutputResponse> => {
  const supabase = await createClient();

  if (!output.outcome_measurable_id || !output.description || !output.code) {
    return { success: false, error: 'Missing required fields' };
  }

  const { data: existingOutputs } = await supabase
    .from('outputs')
    .select('id, code')
    .eq('project_id', output.project_id)
    .neq('id', output.id || 0);

  const isDuplicate = existingOutputs?.some(
    (existingOutput) => existingOutput.code === output.code,
  );

  if (isDuplicate) {
    return {
      success: false,
      error: `Output code "${output.code}" already exists`,
    };
  }

  const { data, error } = await supabase
    .from('outputs')
    .upsert({
      id: output.id,
      outcome_measurable_id: output.outcome_measurable_id,
      project_id: output.project_id,
      description: output.description,
      code: output.code,
      status: output.status,
    })
    .select()
    .single();

  if (error) {
    return {
      success: false,
      error: 'Failed to save output. Please try again.',
    };
  }

  const { data: updatedProject } = await supabase
    .from('projects')
    .update({ last_updated: new Date().toISOString() })
    .eq('id', output.project_id)
    .select()
    .single();

  if (output.id) {
    const { data: updatedOutput } = await supabase
      .from('outputs')
      .update({ last_updated: new Date().toISOString() })
      .eq('id', output.id)
      .select()
      .single();
  }

  return { success: true, data };
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

  const { data: updatedProject } = await supabase
    .from('projects')
    .update({ last_updated: new Date().toISOString() })
    .eq('id', measurable.project_id)
    .select()
    .single();

  const { data: updatedOutput } = await supabase
    .from('outputs')
    .update({ last_updated: new Date().toISOString() })
    .eq('id', measurable.output_id)
    .select()
    .single();

  return data;
};

export async function fetchOutcomeMeasurables(projectId: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('outcome_measurables')
    .select('*')
    .eq('project_id', projectId)
    .order('code');

  if (error) throw error;
  return data;
}
