'use server';

import { createClient } from '@/utils/supabase/server';
import { Update } from '@/utils/types';
import { endOfDay, format, startOfMonth } from 'date-fns';

export const fetchUpdates = async (
  dateRange?: {
    from: string;
    to: string;
  },
  projectId?: number,
) => {
  const supabase = await createClient();

  // Set default date range if not provided
  const today = new Date();
  const defaultFrom = startOfMonth(today);
  const defaultTo = endOfDay(today);

  const dates = {
    from: dateRange?.from || defaultFrom.toISOString(),
    to: dateRange?.to || defaultTo.toISOString(),
  };

  const { data, error } = await supabase
    .from('updates')
    .select(
      '*, projects(name, slug), output_measurables(*), impact_indicators(*), users(*)',
    )
    .gte('date::date', dates.from)
    .lte('date::date', dates.to)
    .match({
      ...(projectId ? { project_id: projectId } : {}),
      valid: true,
      original: true,
    })
    .order('date', { ascending: false });

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

  // Only include posted_by if this is a new update (no id)
  const posted_by = update.id ? undefined : user?.id || null;

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
      posted_by,
      year: update.year || new Date().getFullYear(),
      impact_indicator_id: update.impact_indicator_id,
      source: update.source || 'Maerl',
      original: update.original ?? true,
      duplicate: update.duplicate ?? false,
      verified: update.verified ?? false,
      valid: update.valid ?? true,
    })
    .select()
    .single();

  if (error) throw error;

  // Update the project's last_updated timestamp
  await supabase
    .from('projects')
    .update({ last_updated: new Date().toISOString() })
    .eq('id', update.project_id);

  return { update: data };
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
