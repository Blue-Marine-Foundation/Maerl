'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Project_W_Outputs } from '@/_lib/types';
import ControlledInput from './Input';
import ControlledListbox from './Listbox';
import ControlledRadio from './Radio';
import ControlledCombobox from './Combobox';
import ControlledTextarea from './Textarea';

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
    // First, map each output to an object representing the output itself
    const outputObjects = project.outputs.map((output) => ({
      project_id: project.id,
      output_parent: true,
      value: output.code,
      name: `${output.code}: ${output.description}`,
      unit: undefined,
    }));

    // Then, map each measurable in each output to its own object
    const measurableObjects = project.outputs.flatMap((output) =>
      output.output_measurables.map((measurable) => ({
        project_id: project.id,
        output_parent: false,
        value: measurable.id,
        name: `${measurable.code}: ${measurable.description}`,
        impact_indicator: measurable.impact_indicators?.indicator_code,
        unit: measurable.unit,
      }))
    );

    // Combine the output objects and measurable objects into a single array
    return [...outputObjects, ...measurableObjects];
  });

  const searchParams = useSearchParams();
  const projectParam = searchParams.get('project');
  const outputParam = searchParams.get('output');

  const [targetProject, setTargetProject] = useState(
    projectParam ? parseInt(projectParam) : projects[0].value
  );

  const [filteredOutputs, setFilteredOutputs] = useState(() =>
    outputs
      .filter((output) => output.project_id === targetProject)
      .sort((a, b) => a.name.localeCompare(b.name))
  );

  useEffect(() => {
    const relevantOutputs = outputs
      .filter((output) => output.project_id === targetProject)
      .sort((a, b) => a.name.localeCompare(b.name));
    setFilteredOutputs(relevantOutputs);
    setInputValues((prevValues) => ({
      ...prevValues,
      output: outputParam ? parseInt(outputParam) : relevantOutputs[1].value, // [0] will always be a higher level output
    }));
  }, [targetProject]);

  const [inputValues, setInputValues] = useState({
    user: user,
    project: targetProject,
    output: outputParam ? parseInt(outputParam) : filteredOutputs[1].value, // [0] will always be a higher level output
    update_type: 'Impact',
    date: new Date().toISOString().split('T')[0],
    description: '',
    value: '',
    link: '',
  });

  const handleInputChange = (name: string) => (newValue: string | number) => {
    if (name === 'project') {
      setTargetProject(parseInt(newValue as string));
    }
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
      className='max-w-4xl p-8 mb-4 flex flex-col gap-6 shadow bg-card-bg rounded-md'
      id='newUpdateForm'
      onSubmit={handleSubmit}
    >
      <ControlledListbox
        label='Project'
        options={projects}
        onSelect={handleInputChange('project')}
        initialValue={inputValues.project}
      />
      <ControlledCombobox
        label='Output'
        options={filteredOutputs}
        onSelect={handleInputChange('output')}
        initialValue={inputValues.output}
      />

      <ControlledRadio
        label='Update type'
        onChange={handleInputChange('update_type')}
      />

      <ControlledInput
        type='date'
        initialValue={inputValues.date}
        label='Date'
        placeholder=''
        onChange={handleInputChange('date')}
      />

      <ControlledTextarea
        label='Update description'
        placeholder='A short description of your update, for example, "Report released on the illegality of fishing vessels &apos;going dark&apos;"'
        onChange={handleInputChange('description')}
        isRequired={true}
      />

      {inputValues.update_type === 'Impact' && (
        <ControlledInput
          type='number'
          initialValue={inputValues.value}
          label='Impact stat'
          placeholder='1'
          unit={
            (
              filteredOutputs.find(
                (output) => output.value === inputValues.output
              ) || {}
            ).unit
          }
          onChange={handleInputChange('value')}
        />
      )}

      <ControlledInput
        type='text'
        initialValue={inputValues.link}
        label='Link'
        placeholder='Add a link'
        onChange={handleInputChange('link')}
      />

      <div className='flex justify-end'>
        <button
          type='submit'
          className='px-4 py-2 w-40 text-center bg-btn-background hover:bg-btn-background-hover rounded-md transition-colors duration-500'
        >
          Submit
        </button>
      </div>
    </form>
  );
}
