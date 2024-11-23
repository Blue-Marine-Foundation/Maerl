'use server';

import { createClient } from '@/utils/supabase/server';
import { Update } from '@/utils/types';

export const fetchUpdates = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('updates')
    .select(
      '*, projects(name, slug), output_measurables(*), impact_indicators(*)',
    )
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const upsertUpdate = async (update: Partial<Update>) => {
  const supabase = await createClient();

  if (!update.description) {
    throw new Error('Missing required fields');
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('updates')
    .upsert({
      id: update.id,
      date: update.date || new Date().toISOString().split('T')[0],
      project_id: update.project_id,
      output_measurable_id: update.output_measurable_id || null,
      type: update.type || 'Progress',
      description: update.description,
      value: update.value || null,
      link: update.link || null,
      posted_by: user?.id || null,
      year: update.year || new Date().getFullYear(),
      impact_indicator_id: update.impact_indicator_id,
      source: 'Maerl',
      original: update.original || true,
      duplicate: update.duplicate || false,
      verified: update.verified || false,
      valid: update.valid || true,
    })
    .select()
    .single();

  if (error) throw error;

  const { data: updatedProject } = await supabase
    .from('projects')
    .update({ last_updated: new Date().toISOString() })
    .eq('id', update.project_id)
    .select()
    .single();

  return { update };
};

export const fetchOutputUpdates = async (outputId: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('updates')
    .select(
      '*, projects(name, slug), output_measurables!inner(*), impact_indicators(*)',
    )
    .eq('output_measurables.output_id', outputId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};
