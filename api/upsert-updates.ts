import { createClient } from '@/utils/supabase/server';
import { Update } from '@/utils/types';

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
      duplicate: update.duplicate ?? false,
      verified: update.verified ?? false,
      valid: update.valid ?? true,
      ...(typeof update.admin_reviewed !== 'undefined' && {
        admin_reviewed: update.admin_reviewed,
      }),
      ...(typeof update.review_note !== 'undefined' && {
        review_note: update.review_note,
      }),
    })
    .select()
    .single();

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
    .eq('id', update.project_id);

  return { update: data };
};
