'use client';

import { createClient } from '@/utils/supabase/client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Project_W_Outputs } from '@/_lib/types';
import ControlledInput from './Input';
import ControlledListbox from './Listbox';
import ControlledRadio from './Radio';
import ControlledCombobox from './Combobox';
import ControlledTextarea from './Textarea';
import SuccessMessage from './SuccessMessage';

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

  const supabase = createClient();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmittedSuccessfully, setHasSubmittedSuccessfully] =
    useState(false);

  const [formError, setFormError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setIsSubmitting(true);

    const update = {
      date: inputValues.date,
      project_id: inputValues.project,
      output_measurable_id: inputValues.output,
      type: inputValues.update_type,
      description: inputValues.description,
      value: inputValues.value !== '' ? inputValues.value : null,
      link: inputValues.link,
      posted_by: inputValues.user,
    };

    setTimeout(async () => {
      const { data, error } = await supabase
        .from('updates')
        .insert(update)
        .select();

      if (error) {
        setIsSubmitting(false);
        setHasSubmittedSuccessfully(false);
        setFormError(true);
        setErrorMessage(
          `Error submitting update (please screenshot this error and send it to Appin): ${error.message}`
        );
        console.log('Tried to submit: ', update);
      }

      if (data) {
        console.log(data);
        setFormError(false);
        setErrorMessage('');
        setIsSubmitting(false);
        setHasSubmittedSuccessfully(true);
        setInputValues((prevValues) => ({
          ...prevValues,
          update_type: 'Impact',
          date: new Date().toISOString().split('T')[0],
          description: '',
          value: '',
          link: '',
        }));
        setTimeout(() => {
          setHasSubmittedSuccessfully(false);
        }, 3500);
      }
    }, 1000);
  };

  return (
    <form
      className='relative max-w-4xl p-8 mb-4 flex flex-col gap-6 shadow bg-card-bg rounded-md'
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
        initialValue={inputValues.description}
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

      <div className='flex justify-end items-start gap-8'>
        {formError && <p className='pt-2 pl-2 max-w-md'>{errorMessage}</p>}
        <button
          type='submit'
          className='px-4 py-2 w-40 text-center bg-btn-background hover:bg-btn-background-hover rounded-md transition-colors duration-500'
        >
          {isSubmitting ? (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='mx-auto animate-spin text-purple-200'
            >
              <line x1='12' x2='12' y1='2' y2='6' />
              <line x1='12' x2='12' y1='18' y2='22' />
              <line x1='4.93' x2='7.76' y1='4.93' y2='7.76' />
              <line x1='16.24' x2='19.07' y1='16.24' y2='19.07' />
              <line x1='2' x2='6' y1='12' y2='12' />
              <line x1='18' x2='22' y1='12' y2='12' />
              <line x1='4.93' x2='7.76' y1='19.07' y2='16.24' />
              <line x1='16.24' x2='19.07' y1='7.76' y2='4.93' />
            </svg>
          ) : (
            'Submit'
          )}
        </button>
      </div>

      <SuccessMessage isVisible={hasSubmittedSuccessfully} />
    </form>
  );
}
