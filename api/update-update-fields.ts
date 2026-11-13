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

  for (const update of updates) {
    try {
      const { updateId, field, value } = update;

      // Prepare the update data
      const updateData: any = {
        [field]: value,
      };

      // Apply business logic
      if (field === 'duplicate' && value === true) {
        updateData.valid = false; // If marked as duplicate, set valid to false
      }

      // Only set admin_reviewed to true when other fields are changed
      // (not when admin_reviewed itself is being updated)
      if (field !== 'admin_reviewed') {
        updateData.admin_reviewed = true;
      }

      const { data, error } = await supabase
        .from('updates')
        .update(updateData)
        .eq('id', updateId)
        .select()
        .single();

      if (error) {
        console.error('Update error:', error);
        results.push({
          updateId,
          field,
          success: false,
          error: error.message,
        });
      } else {
        results.push({
          updateId,
          field,
          success: true,
          data,
        });
      }
    } catch (error) {
      console.error('Update error:', error);
      results.push({
        updateId: update.updateId,
        field: update.field,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  return results;
};
