import React, { useState } from 'react';
import {
  EditableProjectMetadata,
  ProjectMetadata,
  ProjectMetadataUpdate,
} from '@/utils/types';
import {
  GeographyComboboxInput,
  LocalContactInput,
  SelectInput,
  TextInput,
} from './form-inputs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import updateProjectMetadata from './server-actions';
import { normalizeProjectGeography } from '@/components/overview/country-impact-map/country-iso-map';
import {
  CANONICAL_PROJECT_STATUSES,
  normalizeProjectStatus,
} from './project-field-options';

type EditFormProps = {
  project: ProjectMetadata;
  onClose: () => void;
};

const EditForm: React.FC<EditFormProps> = ({ project, onClose }) => {
  const [formState, setFormState] = useState<ProjectMetadata>(project);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocalContactsChange = (
    contacts: ProjectMetadata['local_contacts'],
  ) => {
    setFormState((prev) => ({ ...prev, local_contacts: contacts }));
  };

  const handleProjectCountryChange = (projectCountry: string | null) => {
    setFormState((prev) => ({
      ...prev,
      project_country: projectCountry,
    }));
  };

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: ProjectMetadataUpdate) => updateProjectMetadata(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectMetadata'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({
        queryKey: ['overview-country-impact-map'],
      });
      onClose();
    },
    onError: (error: Error) => {
      setErrorMessage(
        `Unable to save! Error: ${error.message}. Sorry about this. Please screenshot this whole page and send it to Suneha.` ||
          'An error occurred while saving changes.',
      );
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    const changes: ProjectMetadataUpdate['changes'] = {};
    const setIfChanged = <Key extends keyof EditableProjectMetadata>(
      key: Key,
      value: EditableProjectMetadata[Key],
    ) => {
      const previousValue = project[key];
      if (JSON.stringify(previousValue) !== JSON.stringify(value)) {
        changes[key] = value;
      }
    };

    setIfChanged('support', formState.support);
    setIfChanged('start_date', formState.start_date);
    setIfChanged('project_tier', formState.project_tier);
    setIfChanged('regional_strategy', formState.regional_strategy);
    setIfChanged('unit_requirements', formState.unit_requirements);
    setIfChanged('pillars', formState.pillars);
    setIfChanged('highlights', formState.highlights);
    setIfChanged('current_issues', formState.current_issues);
    setIfChanged('proposed_solutions', formState.proposed_solutions);
    setIfChanged(
      'board_intervention_required',
      formState.board_intervention_required,
    );
    setIfChanged(
      'local_contacts',
      (formState.local_contacts ?? []).filter(
        (contact) =>
          contact.name.trim() !== '' || contact.organisation.trim() !== '',
      ),
    );

    if (formState.project_country !== project.project_country) {
      const normalizedCountry = normalizeProjectGeography(
        formState.project_country,
      );
      changes.project_country = normalizedCountry || null;
    }
    if (formState.project_status !== project.project_status) {
      const normalizedStatus = normalizeProjectStatus(formState.project_status);
      changes.project_status = normalizedStatus || null;
    }

    if (Object.keys(changes).length === 0) {
      onClose();
      return;
    }

    try {
      await mutation.mutateAsync({ id: project.id, changes });
    } catch {
      // The mutation callback renders the field-specific server error.
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='flex max-w-full flex-col gap-3 py-4 text-xs'
    >
      <div className='flex items-baseline gap-4'>
        <span className='w-40 flex-shrink-0 text-muted-foreground'>PM:</span>
        <span className='flex-grow text-foreground'>{project.pm}</span>
      </div>

      <TextInput
        label='Support'
        name='support'
        value={formState.support}
        onChange={handleChange}
        placeholder='Supporting staff'
      />

      <TextInput
        label='Start Date'
        name='start_date'
        value={formState.start_date}
        onChange={handleChange}
        placeholder='Project start date'
      />

      <SelectInput
        label='Project Status'
        name='project_status'
        value={formState.project_status}
        onChange={handleChange}
        options={[
          { value: '', label: 'Not set' },
          ...CANONICAL_PROJECT_STATUSES.map((status) => ({
            value: status,
            label: status,
          })),
        ]}
        placeholder={''}
        legacyWarning='Project Status is awaiting an owner decision. You can save other fields unchanged, but changing this field requires Pipeline, Active, Complete, or Not set.'
      />

      <SelectInput
        label='Project Tier'
        name='project_tier'
        value={formState.project_tier || ''}
        onChange={handleChange}
        options={[
          { value: '', label: 'Select a tier' },
          { value: 't1', label: 'Tier 1: Boots on the ground' },
          {
            value: 't2',
            label:
              'Tier 2: Unit usage, political support, capacity building of local partners',
          },
          {
            value: 't3',
            label:
              'Tier 3: Light touch guidance/technical support alongside financial support',
          },
          {
            value: 't4',
            label:
              'Tier 4: On hold - dormant project waiting for opportune moment to reengage',
          },
        ]}
        placeholder={'Select project tier'}
      />

      <GeographyComboboxInput
        value={formState.project_country}
        onValueChange={handleProjectCountryChange}
      />

      <TextInput
        label='Regional Strategy'
        name='regional_strategy'
        value={formState.regional_strategy}
        onChange={handleChange}
        placeholder='Regional Strategy'
      />

      <TextInput
        label='Units'
        name='unit_requirements'
        value={formState.unit_requirements}
        onChange={handleChange}
        placeholder='Unit requirements'
      />

      <TextInput
        label='Strategic Goals'
        name='pillars'
        value={formState.pillars}
        onChange={handleChange}
        placeholder='Strategic Goals'
      />

      <LocalContactInput
        contacts={formState.local_contacts}
        onChange={handleLocalContactsChange}
      />

      <TextInput
        label='Highlights'
        name='highlights'
        value={formState.highlights}
        onChange={handleChange}
        placeholder='Project highlights'
      />

      <TextInput
        label='Current Issues'
        name='current_issues'
        value={formState.current_issues}
        onChange={handleChange}
        placeholder='Current issues'
      />

      <TextInput
        label='Proposed Solutions'
        name='proposed_solutions'
        value={formState.proposed_solutions}
        onChange={handleChange}
        placeholder='Proposed solutions'
      />

      <TextInput
        label='Board Intervention'
        name='board_intervention_required'
        value={formState.board_intervention_required}
        onChange={handleChange}
        placeholder='Board intervention required'
      />

      {errorMessage && (
        <div className='ml-auto max-w-prose rounded-md bg-red-600/10 p-2 text-red-700 dark:text-red-400'>
          <p>{errorMessage}</p>
        </div>
      )}

      <div className='flex justify-end gap-2 text-sm'>
        <button
          type='button'
          onClick={onClose}
          className='rounded bg-secondary px-2 py-1 text-secondary-foreground hover:bg-muted'
        >
          Cancel
        </button>
        <button
          type='submit'
          className='rounded bg-primary px-2 py-1 text-primary-foreground hover:bg-primary/90'
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};

export default EditForm;
