'use server';

import { createClient } from '@/utils/supabase/server';
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
