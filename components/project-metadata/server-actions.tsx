'use server';

import { createClient } from '@/utils/supabase/server';
import {
  EditableProjectMetadata,
  ProjectMetadata,
  ProjectMetadataUpdate,
} from '@/utils/types';
import {
  isCanonicalProjectGeography,
  normalizeProjectGeography,
} from '@/components/overview/country-impact-map/country-iso-map';
import {
  isCanonicalProjectStatus,
  normalizeProjectStatus,
} from './project-field-options';

const EDITABLE_PROJECT_METADATA_FIELDS: (keyof EditableProjectMetadata)[] = [
  'support',
  'start_date',
  'project_status',
  'project_tier',
  'project_country',
  'regional_strategy',
  'unit_requirements',
  'pillars',
  'local_contacts',
  'highlights',
  'current_issues',
  'proposed_solutions',
  'board_intervention_required',
];

const EDITABLE_PROJECT_METADATA_FIELD_SET = new Set<string>(
  EDITABLE_PROJECT_METADATA_FIELDS,
);

export async function fetchProjectMetadata(
  projectId: number,
): Promise<ProjectMetadata> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('projects')
    .select('*, users(first_name, last_name)')
    .eq('id', projectId)
    .single();

  if (error || !data) {
    throw error || new Error('Project not found');
  }

  const pm = data.users
    ? `${data.users.first_name} ${data.users.last_name}`.trim()
    : null;

  const flatProject: ProjectMetadata = { ...data, pm };

  return flatProject;
}

export default async function updateProjectMetadata({
  id,
  changes,
}: ProjectMetadataUpdate) {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error('Project ID must be a positive integer');
  }

  const submittedFields = Object.keys(changes);
  const unsupportedField = submittedFields.find(
    (field) => !EDITABLE_PROJECT_METADATA_FIELD_SET.has(field),
  );
  if (unsupportedField) {
    throw new Error(`Unsupported project field "${unsupportedField}"`);
  }
  if (submittedFields.length === 0) {
    throw new Error('No project metadata changes were submitted');
  }

  const update: Partial<EditableProjectMetadata> & { last_updated: string } = {
    last_updated: new Date().toISOString(),
  };

  for (const field of EDITABLE_PROJECT_METADATA_FIELDS) {
    if (
      field === 'project_country' ||
      field === 'project_status' ||
      !Object.prototype.hasOwnProperty.call(changes, field)
    ) {
      continue;
    }
    Object.assign(update, { [field]: changes[field] });
  }

  if (Object.prototype.hasOwnProperty.call(changes, 'project_country')) {
    const rawCountry = changes.project_country;
    const normalizedCountry = normalizeProjectGeography(rawCountry);
    if (!isCanonicalProjectGeography(normalizedCountry)) {
      throw new Error(
        `Project Country "${rawCountry ?? ''}" is not a canonical geography`,
      );
    }
    update.project_country = normalizedCountry || null;
  }

  if (Object.prototype.hasOwnProperty.call(changes, 'project_status')) {
    const rawStatus = changes.project_status;
    const normalizedStatus = normalizeProjectStatus(rawStatus);
    if (!isCanonicalProjectStatus(normalizedStatus)) {
      throw new Error(
        `Project Status "${rawStatus ?? ''}" must be Pipeline, Active, Complete, or Not set`,
      );
    }
    update.project_status = normalizedStatus || null;
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('projects')
    .update(update)
    .eq('id', id)
    .select();

  if (error) {
    throw new Error(error.message || 'Failed to update project metadata');
  }
  if (!data || data.length === 0) {
    throw new Error(
      'Project metadata update did not match an editable project',
    );
  }

  return data;
}
