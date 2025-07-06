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

  const results = [];

  for (const update of updates) {
    try {
      const { updateId, field, value } = update;

      // Prepare the update data
      const updateData: any = {
        [field]: value,
        admin_reviewed: true, // Always mark as reviewed when admin makes changes
      };

      // Apply business logic
      if (field === 'duplicate' && value === true) {
        updateData.valid = false; // If marked as duplicate, set valid to false
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
