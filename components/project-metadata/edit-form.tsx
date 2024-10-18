import React, { useState } from 'react';
import { ProjectMetadata } from '@/utils/types';
import { TextInput, SelectInput, LocalContactInput } from './form-inputs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import upsertProjectMetadata from './server-actions';

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

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: ProjectMetadata) => upsertProjectMetadata(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectMetadata'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
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
    const cleanedFormState = {
      ...formState,
      local_contacts: formState.local_contacts.filter(
        (contact) =>
          contact.name.trim() !== '' || contact.organisation.trim() !== '',
      ),
    };
    try {
      await mutation.mutateAsync(cleanedFormState);
    } catch (error) {
      // Error will be handled by onError callback, no need to do anything here
      console.log('Error submitting form:', error);
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
          { value: 'Pipeline', label: 'Pipeline' },
          { value: 'Active', label: 'Active' },
          { value: 'Complete', label: 'Complete' },
        ]}
        placeholder={''}
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
        label='Pillars'
        name='pillars'
        value={formState.pillars}
        onChange={handleChange}
        placeholder='Pillars'
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
        <div className='ml-auto max-w-prose rounded-md bg-red-500/10 p-2 text-red-500'>
          <p>{errorMessage}</p>
        </div>
      )}

      <div className='flex justify-end gap-2 text-sm'>
        <button
          type='button'
          onClick={onClose}
          className='rounded bg-gray-200 px-2 py-1 text-gray-800 hover:bg-gray-300'
        >
          Cancel
        </button>
        <button
          type='submit'
          className='rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-600'
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};

export default EditForm;
