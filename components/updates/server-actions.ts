'use server';

import { createClient } from '@/utils/supabase/server';
import { Update } from '@/utils/types';
import { endOfDay, startOfMonth } from 'date-fns';

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
      duplicate: false,
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

  // Debug logging
  console.log('Debug - Update attempt:', {
    userId: user?.id,
    updateData: {
      id: update.id,
      project_id: update.project_id,
      output_measurable_id: update.output_measurable_id,
      description: update.description,
      posted_by
    }
  });

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
      duplicate: update.duplicate ?? false,
      verified: update.verified ?? false,
      valid: update.valid ?? true,
    })
    .select()
    .single();

  if (error) {
    // Debug logging
    console.log('Debug - Update error:', {
      error: {
        code: error.code,
        message: error.message,
        details: error.details
      },
      attemptedBy: user?.id
    });
    
    // Handle specific error cases
    if (error.code === '42501') { // PostgreSQL permission denied error
      throw new Error('You do not have permission to edit this update. Please contact the M&E team.');
    }
    if (error.code === '23503') { // Foreign key violation
      throw new Error('Invalid project or measurable reference. Please refresh and try again.');
    }
    if (error.code === '23505') { // Unique violation
      throw new Error('This update already exists.');
    }
    // For any other errors, provide a generic message but log the full error
    console.error('Update error:', error);
    throw new Error('Unable to save update. Please try again or contact the M&E team if the problem persists.');
  }

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
