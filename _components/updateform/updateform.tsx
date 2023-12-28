'use client';

import { createClient } from '@/_utils/supabase/client';
import { useState, useEffect } from 'react';
import { Project_W_Outputs } from '@/_lib/types';
import ControlledTextInput from './Input';
import Spinner from '@/_components/Spinner';
import ControlledListbox from './Listbox';

interface NewUpdate {
  project_id: number | string;
  date: string;
  output_measurable_id: string | number;
  type: string;
  description: string;
  value: number | null;
  link: string | null;
}

export default function UpdateForm({
  data,
  user,
}: {
  data: Project_W_Outputs[];
  user: string;
}) {
  const projects = data.map((project) => {
    return { name: project.name, value: project.id };
  });

  const outputs = data.flatMap((project) => {
    return project.outputs.map((output) => {
      const measurables = output.output_measurables.map((measurable) => {
        return {
          name: `${measurable.code}: ${measurable.description}`,
          value: measurable.id,
        };
      });

      return {
        project_id: project.id,
        name: output.description,
        id: output.id,
        code: output.code,
        measurables: measurables,
      };
    });
  });

  const [inputValues, setInputValues] = useState({
    user: user,
    project: projects[0].value,
    // output: outputs[0].id,
    update_type: 'Impact',
    input1: '',
    date: new Date().toISOString().split('T')[0],
    input3: '',
  });

  const handleInputChange = (name: string) => (newValue: string | number) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [name]: newValue,
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Input Values:', inputValues);
  };

  return (
    <form
      className='max-w-2xl p-8 mb-4 shadow bg-card-bg rounded-md'
      id='newUpdateForm'
      onSubmit={handleSubmit}
    >
      <ControlledListbox
        label='Project'
        options={projects}
        onSelect={handleInputChange('project')}
      />
      {/* <ControlledListbox
        label='Output'
        options={outputs}
        onSelect={handleInputChange('output')}
      /> */}
      <ControlledListbox
        label='Update type'
        options={[
          { name: 'Impact', value: 'Impact' },
          { name: 'Progress', value: 'Progress' },
        ]}
        onSelect={handleInputChange('update_type')}
      />
      <ControlledTextInput
        type='text'
        label='First input:'
        initialValue={inputValues.input1}
        placeholder='Some text here'
        onChange={handleInputChange('input1')}
      />
      <ControlledTextInput
        type='date'
        initialValue={inputValues.date}
        label='Date:'
        placeholder=''
        onChange={handleInputChange('input2')}
      />
      <ControlledTextInput
        type='textarea'
        initialValue={inputValues.input3}
        label='Third input:'
        placeholder='Some text here'
        onChange={handleInputChange('input3')}
      />
      <button
        type='submit'
        className='px-4 py-2 w-40 text-center bg-btn-background hover:bg-btn-background-hover rounded-md transition-colors duration-500'
      >
        Submit
      </button>
    </form>
  );
}
