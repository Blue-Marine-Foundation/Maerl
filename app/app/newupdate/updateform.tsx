'use client';

import { Project } from '@/_lib/types';
import { createClient } from '@/_utils/supabase/client';
import { useState, ChangeEvent, FormEvent } from 'react';
import Spinner from '@/_components/Spinner';

function filterProjectOutputs(data: Project[], id: number) {
  return data
    .filter((d) => id === d.id)
    .flatMap((d) => {
      return d.outputs;
    });
}

interface NewUpdate {
  project_id: number | string;
  date: string;
  output_measurable_id: string | number;
  type: string;
  description: string;
  value: number | null;
  link: string | null;
}

export default function UpdateForm({ data }: { data: Project[] }) {
  const supabase = createClient();

  const initialOutputs = filterProjectOutputs(data, data[0].id);
  const initialUnit =
    data[0]?.outputs?.[0]?.output_measurables?.[0]?.unit || null;

  const [projectOutputs, setProjectOutputs] = useState(initialOutputs);
  const [updateType, setUpdateType] = useState('progress');
  const [selectedOutputUnit, setSelectedOutputUnit] = useState(initialUnit);

  const [formData, setFormData] = useState<NewUpdate>({
    type: 'progress',
    project_id: data[0].id,
    output_measurable_id: data[0]!.outputs![0].output_measurables![0]!.id,
    date: '',
    description: '',
    value: null,
    link: null,
  });

  const updateData = (
    e:
      | ChangeEvent<HTMLInputElement>
      | ChangeEvent<HTMLSelectElement>
      | ChangeEvent<HTMLTextAreaElement>
  ) => {
    const newState = {
      ...formData,
      [e.target.name]: e.target.value,
    };
    console.log(newState);
    setFormData(newState);
  };

  const handleTypeSelection = (event: ChangeEvent<HTMLSelectElement>) => {
    setUpdateType(event.target.value);
    updateData(event);
  };

  const handleProjectSelection = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedProjectID = parseInt(event.target.value);
    const newOutputs = filterProjectOutputs(data, selectedProjectID);
    setProjectOutputs(newOutputs);
    setSelectedOutputUnit(newOutputs![0]!.output_measurables![0]!.unit);
    const defaultOutputMeasurable = newOutputs[0]!.output_measurables![0].id;
    setFormData({
      ...formData,
      project_id: selectedProjectID,
      output_measurable_id: defaultOutputMeasurable,
    });
  };

  const handleOutputSelection = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedIndex = event.target.selectedIndex;
    const unit = event.target.options[selectedIndex].getAttribute('data-unit');
    setSelectedOutputUnit(unit);
    updateData(event);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const newUpdate = {
      ...formData,
      project_id: parseInt(formData.project_id.toString()),
      output_measurable_id: parseInt(formData.output_measurable_id?.toString()),
      value: formData.value ? parseFloat(formData.value.toString()) : null,
    };

    const { data, error } = await supabase
      .from('updates')
      .insert([newUpdate])
      .select();

    if (data) {
      console.log(data);
      setTimeout(() => {
        (event.target as HTMLFormElement).reset();
        setIsSubmitting(false);
        setUpdateType('progress');
        setFormMessage('Update successfully submitted');
        setTimeout(() => {
          setFormMessage('');
        }, 3000);
      }, 1000);
    }

    if (error) {
      console.log(error);
      setTimeout(() => {
        setIsSubmitting(false);
        setFormMessage(`Error submitting update: ${error.message}`);
        setTimeout(() => {
          setFormMessage('');
        }, 3000);
      });
    }
  };

  return (
    <form
      className='p-8 mb-24 shadow bg-card-bg rounded-md'
      onSubmit={handleSubmit}
      id='newUpdateForm'
    >
      <div className='mb-4 flex justify-start items-start gap-4'>
        <div className='mb-4'>
          <label htmlFor='type' className='pb-2 block text-sm tracking-wide'>
            Type
          </label>
          <div className='inline-block relative w-44'>
            <select
              id='type'
              name='type'
              onChange={handleTypeSelection}
              className='block appearance-none w-full px-4 py-2 text-foreground bg-[#313B4F] border border-foreground/10 hover:border-btn-background rounded shadow leading-tight'
            >
              <option value='Progress'>Progress update</option>
              <option value='Impact'>Impact update</option>
            </select>
            <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
              <svg
                className='fill-foreground h-4 w-4'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 20 20'
              >
                <path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
              </svg>
            </div>
          </div>
        </div>

        <div className='mb-4'>
          <label htmlFor='date' className='pb-2 block text-sm tracking-wide'>
            Date
          </label>
          <input
            type='date'
            onChange={updateData}
            id='date'
            name='date'
            className='block appearance-none w-full px-4 py-2 bg-[#313B4F] border border-foreground/10 hover:border-btn-background rounded shadow leading-tight focus:outline-none focus:shadow-outline'
            required
          />
        </div>

        <div className='mb-4'>
          <label
            htmlFor='project_id'
            className='pb-2 block text-sm tracking-wide'
          >
            Project
          </label>
          <div className='inline-block relative w-40'>
            <select
              id='project_id'
              name='project_id'
              onChange={handleProjectSelection}
              className='block appearance-none w-full text-foreground px-4 py-2 pr-8 bg-[#313B4F] border border-foreground/10 hover:border-btn-background  rounded shadow leading-tight focus:outline-none focus:shadow-outline'
            >
              {data.map((d) => {
                return (
                  <option
                    key={d.id}
                    value={d.id}
                    className='px-2 py-1 dark:text-foreground '
                  >
                    {d.name}
                  </option>
                );
              })}
            </select>
            <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
              <svg
                className='fill-foreground h-4 w-4'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 20 20'
              >
                <path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
              </svg>
            </div>
          </div>
        </div>

        <div className='mb-4'>
          <label htmlFor='output' className='pb-2 block text-sm tracking-wide'>
            Output
          </label>
          <div className='inline-block relative w-full'>
            <select
              id='output'
              name='output_measurable_id'
              onChange={handleOutputSelection}
              className='block appearance-none w-full px-4 py-2 pr-8 bg-[#313B4F] border border-foreground/10 hover:border-btn-background rounded shadow leading-tight focus:outline-none focus:shadow-outline'
            >
              {projectOutputs &&
                projectOutputs.map((d) => {
                  return (
                    <optgroup
                      key={d?.id}
                      label={`${d?.code}: ${
                        d!.description.length >= 75
                          ? d!.description.slice(0, 70) + '...'
                          : d!.description
                      }`}
                      className='text-xs'
                    >
                      {d?.output_measurables &&
                        d.output_measurables.map((om) => {
                          return (
                            <option
                              key={om.id}
                              value={om.id}
                              data-unit={om.unit}
                              className='px-2 py-1 dark:text-foreground text-sm'
                            >
                              {`${om.code}: ${
                                om.description.length >= 75
                                  ? om.description.slice(0, 70) + '...'
                                  : om.description
                              }`}
                            </option>
                          );
                        })}
                    </optgroup>
                  );
                })}
            </select>
            <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
              <svg
                className='fill-foreground h-4 w-4'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 20 20'
              >
                <path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className='mb-4'>
        <label
          htmlFor='description'
          className='pb-2 block text-sm tracking-wide'
        >
          Description
        </label>
        <textarea
          id='description'
          name='description'
          onChange={updateData}
          rows={3}
          className='block appearance-none w-full px-4 py-2 bg-[#313B4F] border border-foreground/10 hover:border-btn-background rounded shadow leading-tight focus:outline-none focus:shadow-outline'
          placeholder='Add your update description here...'
          required
        />
      </div>
      <div className='mb-4 flex justify-end items-end gap-4'>
        {updateType === 'Impact' && (
          <>
            <div className='mb-4 basis-1/2 flex justify-end items-center'>
              <input
                type='number'
                id='impact'
                name='value'
                onChange={updateData}
                className='block appearance-none w-32 pl-4 pr-2 py-2  bg-[#313B4F] border-l border-t border-b border-foreground/10 hover:border-btn-background rounded-l  leading-tight focus:outline-none focus:shadow-outline'
                required
              />
              <p className='mr-2 block appearance-none py-2 pl-2 pr-4 border-t border-b border-r bg-[#313B4F] border-foreground/10 rounded-r leading-tight'>
                {selectedOutputUnit}
              </p>
            </div>
          </>
        )}

        <div className='mb-4 basis-1/2'>
          <label htmlFor='link' className='pb-2 block text-sm tracking-wide'>
            Link
          </label>
          <input
            type='text'
            id='link'
            name='link'
            onChange={updateData}
            placeholder='Add a link to the cold hard PROOF'
            className='block appearance-none w-full px-4 py-2 bg-[#313B4F] border border-foreground/10 hover:border-btn-background rounded shadow leading-tight focus:outline-none focus:shadow-outline'
          />
        </div>
      </div>
      <div className='mb-4 flex justify-end items-center gap-4'>
        <p>{formMessage}</p>
        <button
          type='submit'
          className='px-4 py-2 w-40 text-center border border-foreground/50 rounded-md hover:bg-btn-background transition-colors'
        >
          {isSubmitting ? <Spinner /> : 'Add update'}
        </button>
      </div>
    </form>
  );
}
