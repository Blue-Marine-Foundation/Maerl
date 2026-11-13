'use server';

import { createClient } from '@/utils/supabase/server';
import { Update } from '@/utils/types';

export const upsertUpdate = async (update: Partial<Update>) => {
  const supabase = await createClient();

  if (
    (!update.id && !update.description?.trim()) ||
    (update.description !== undefined && !update.description.trim())
  ) {
    throw new Error('Missing required fields');
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');
  if (
    update.output_measurable_id != null &&
    update.outcome_measurable_id != null
  ) {
    throw new Error(
      'Choose either an Outcome Indicator or an Output Indicator.',
    );
  }

  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();
  if (profileError) throw profileError;
  const isAdmin = profile.role === 'Admin' || profile.role === 'Super Admin';
  const reviewFields = [
    'duplicate',
    'verified',
    'valid',
    'admin_reviewed',
    'review_note',
  ] as const;
  const review = Object.fromEntries(
    reviewFields
      .filter((field) => isAdmin && update[field] !== undefined)
      .map((field) => [field, update[field]]),
  );

  const date = update.date || new Date().toISOString().split('T')[0];
  const fields = update.id
    ? {
        ...(update.date !== undefined && {
          date: update.date,
          year: Number(update.date.slice(0, 4)),
        }),
        ...(update.type !== undefined && { type: update.type }),
        ...(update.description !== undefined && {
          description: update.description,
        }),
        ...(update.value !== undefined && { value: update.value }),
        ...(update.type === 'Progress' && { value: null }),
        ...(update.link !== undefined && { link: update.link || null }),
        ...(update.source !== undefined && {
          source: update.source || 'Maerl',
        }),
        ...review,
      }
    : {
        date,
        type: update.type || 'Progress',
        description: update.description,
        value: update.type === 'Impact' ? (update.value ?? null) : null,
        link: update.link || null,
        year: Number(date.slice(0, 4)),
        source: update.source || 'Maerl',
        ...review,
      };

  // Updating content never rewrites ownership or the historical impact mapping.
  // INSERT and UPDATE are separate because BEFORE INSERT triggers also run on upserts.
  const query = update.id
    ? supabase.from('updates').update(fields).eq('id', update.id)
    : supabase.from('updates').insert({
        ...fields,
        project_id: update.project_id,
        output_measurable_id: update.output_measurable_id ?? null,
        outcome_measurable_id: update.outcome_measurable_id ?? null,
        impact_indicator_id: update.impact_indicator_id,
        posted_by: user.id,
      });
  const { data, error } = await query.select().single();

  if (error) {
    // Debug logging
    console.log('Debug - Update error:', {
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
      attemptedBy: user?.id,
    });

    // Handle specific error cases
    if (error.code === '42501') {
      // PostgreSQL permission denied error
      throw new Error(
        'You do not have permission to edit this update. Please contact the M&E team.',
      );
    }
    if (error.code === '23503') {
      // Foreign key violation
      throw new Error(
        'Invalid project or measurable reference. Please refresh and try again.',
      );
    }
    if (error.code === '23505') {
      // Unique violation
      throw new Error('This update already exists.');
    }
    // For any other errors, provide a generic message but log the full error
    console.error('Update error:', error);
    throw new Error(
      'Unable to save update. Please try again or contact the M&E team if the problem persists.',
    );
  }

  // Update the project's last_updated timestamp
  await supabase
    .from('projects')
    .update({ last_updated: new Date().toISOString() })
    .eq('id', data.project_id);

  return { update: data };
};
