'use server';

import { Output } from '@/utils/types';
import { createClient } from '@/utils/supabase/server';

type ArchiveOutputResponse = {
  success: boolean;
  data?: Output;
  error?: string;
};

export const archiveOutput = async (
  outputId: number,
  projectId: number,
): Promise<ArchiveOutputResponse> => {
  const supabase = await createClient();

  // Set output as archived
  const { data, error } = await supabase
    .from('outputs')
    .update({
      archived: true,
      last_updated: new Date().toISOString(),
    })
    .eq('id', outputId)
    .select()
    .single();

  if (error) {
    return { success: false, error: 'Failed to archive output.' };
  }

  // Update project last_updated timestamp
  const { data: updatedProject, error: projectError } = await supabase
    .from('projects')
    .update({ last_updated: new Date().toISOString() })
    .eq('id', projectId)
    .select()
    .single();

  if (projectError) {
    return { success: false, error: 'Failed to update project timestamp.' };
  }

  return { success: true, data };
};

export const unarchiveOutput = async (
  outputId: number,
  projectId: number,
): Promise<ArchiveOutputResponse> => {
  const supabase = await createClient();

  // Set output as not archived
  const { data, error } = await supabase
    .from('outputs')
    .update({
      archived: false,
      last_updated: new Date().toISOString(),
    })
    .eq('id', outputId)
    .select()
    .single();

  if (error) {
    return { success: false, error: 'Failed to unarchive output.' };
  }

  // Update project last_updated timestamp
  const { data: updatedProject, error: projectError } = await supabase
    .from('projects')
    .update({ last_updated: new Date().toISOString() })
    .eq('id', projectId)
    .select()
    .single();

  if (projectError) {
    return { success: false, error: 'Failed to update project timestamp.' };
  }

  return { success: true, data };
};

export const archiveOutputMeasurable = async (
  measurableId: number,
  projectId: number,
): Promise<ArchiveOutputResponse> => {
  const supabase = await createClient();

  // Set measurable as archived
  const { data, error } = await supabase
    .from('output_measurables')
    .update({
      archived: true,
      last_updated: new Date().toISOString(),
    })
    .eq('id', measurableId)
    .select()
    .single();

  if (error) {
    console.error('Error archiving measurable:', error);
    return {
      success: false,
      error: error.message || 'Failed to archive measurable.',
    };
  }

  // Update project last_updated timestamp
  const { data: updatedProject, error: projectError } = await supabase
    .from('projects')
    .update({ last_updated: new Date().toISOString() })
    .eq('id', projectId)
    .select()
    .single();

  if (projectError) {
    console.error('Error updating project timestamp:', projectError);
    return {
      success: false,
      error: projectError.message || 'Failed to update project timestamp.',
    };
  }

  return { success: true, data };
};

export const unarchiveOutputMeasurable = async (
  measurableId: number,
  projectId: number,
): Promise<ArchiveOutputResponse> => {
  const supabase = await createClient();

  // Set measurable as not archived
  const { data, error } = await supabase
    .from('output_measurables')
    .update({
      archived: false,
      last_updated: new Date().toISOString(),
    })
    .eq('id', measurableId)
    .select()
    .single();

  if (error) {
    console.error('Error unarchiving measurable:', error);
    return {
      success: false,
      error: error.message || 'Failed to unarchive measurable.',
    };
  }

  // Update project last_updated timestamp
  const { data: updatedProject, error: projectError } = await supabase
    .from('projects')
    .update({ last_updated: new Date().toISOString() })
    .eq('id', projectId)
    .select()
    .single();

  if (projectError) {
    console.error('Error updating project timestamp:', projectError);
    return {
      success: false,
      error: projectError.message || 'Failed to update project timestamp.',
    };
  }

  return { success: true, data };
};
