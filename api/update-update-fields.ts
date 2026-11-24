'use server';

import { createClient } from '@/utils/supabase/server';

interface UpdateField {
  updateId: number;
  field: string;
  value: any;
}

export const updateUpdateFields = async (updates: UpdateField[]) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();
  if (profileError) throw profileError;
  if (!['Admin', 'Super Admin'].includes(profile.role))
    throw new Error('Only admins may review updates');
  const allowedFields = [
    'duplicate',
    'verified',
    'valid',
    'admin_reviewed',
    'review_note',
  ];
  for (const update of updates) {
    if (
      !allowedFields.includes(update.field) ||
      (update.field === 'review_note'
        ? typeof update.value !== 'string'
        : typeof update.value !== 'boolean')
    ) {
      throw new Error('Invalid review field or value');
    }
  }

  const results = [];
  const grouped = new Map<number, UpdateField[]>();
  for (const change of updates) {
    const group = grouped.get(change.updateId) ?? [];
    group.push(change);
    grouped.set(change.updateId, group);
  }

  for (const [updateId, changes] of Array.from(grouped)) {
    try {
      // Save the row's checks together, so a refresh cannot see half a review.
      const updateData: Record<string, any> = {};
      for (const { field, value } of changes) {
        updateData[field] = value;
        if (field === 'duplicate' && value === true) updateData.valid = false;
      }
      if (updateData.duplicate === true) updateData.valid = false;

      // Completing the review remains an explicit admin_reviewed change.
      const { data, error } = await supabase
        .from('updates')
        .update(updateData)
        .eq('id', updateId)
        .select()
        .single();

      if (error) throw error;
      for (const { field } of changes)
        results.push({ updateId, field, success: true, data });
    } catch (error) {
      console.error('Update error:', error);
      for (const { field } of changes)
        results.push({
          updateId,
          field,
          success: false,
          error:
            error instanceof Error ? error.message : 'Unable to save review',
        });
    }
  }

  return results;
};
