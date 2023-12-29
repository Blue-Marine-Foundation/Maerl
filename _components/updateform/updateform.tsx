'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Project_W_Outputs } from '@/_lib/types';
import ControlledInput from './Input';
import ControlledListbox from './Listbox';

export default function UpdateForm({
  data,
  user,
}: {
  data: Project_W_Outputs[];
  user: string;
}) {
  const searchParams = useSearchParams();

  const targetProject = searchParams.get('project')
    ? parseInt(searchParams.get('project')!)
    : null;

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
    project: targetProject ? targetProject : projects[0].value,
    // output: outputs[0].id,
    update_type: 'Impact',
    date: new Date().toISOString().split('T')[0],
    description: '',
    link: '',
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
        initialValue={inputValues.project}
      />
      {/* <ControlledListbox
        label='Output'
        options={outputs}
        onSelect={handleInputChange('output')}
      /> */}
      {/* <ControlledListbox
        label='Update type'
        options={[
          { name: 'Impact', value: 'Impact' },
          { name: 'Progress', value: 'Progress' },
        ]}
        onSelect={handleInputChange('update_type')}
        initialValue={inputValues.update_type}
      /> */}
      <ControlledInput
        type='date'
        initialValue={inputValues.date}
        label='Date'
        placeholder=''
        onChange={handleInputChange('date')}
      />
      <ControlledInput
        type='text'
        initialValue={inputValues.link}
        label='Link'
        placeholder='Add a link'
        onChange={handleInputChange('link')}
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
