'use client';

import { Project } from '@/_lib/types';
import { useState, ChangeEvent } from 'react';

function filterProjectOutputs(data, id) {
  return data
    .filter((d) => id === d.id)
    .flatMap((d) => {
      return d.outputs;
    });
}

export default function UpdateForm({ data }: { data: Project[] }) {
  const initialOutputs = filterProjectOutputs(data, data[0].id);

  const [projectOutputs, setProjectOutputs] = useState(initialOutputs);
  const [updateType, setUpdateType] = useState('progress');
  const [selectedOutputUnit, setSelectedOutputUnit] = useState(
    data[0]?.outputs[0]?.output_measurables[0].unit || null
  );

  const handleTypeSelection = (event: ChangeEvent<HTMLSelectElement>) => {
    setUpdateType(event.target.value);
  };

  const handleProjectSelection = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedProjectID = parseInt(event.target.value);
    const newOutputs = filterProjectOutputs(data, selectedProjectID);
    setProjectOutputs(newOutputs);
  };

  const handleOutputSelection = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedIndex = event.target.selectedIndex;
    const unit = event.target.options[selectedIndex].getAttribute('data-unit');
    setSelectedOutputUnit(unit);
  };

  return (
    <form className='px-8 py-4 border border-foreground/10 rounded-md'>
      <div className='mb-4 flex justify-start items-start gap-4'>
        <div className='mb-4'>
          <label htmlFor='type' className='pb-2 block'>
            Type
          </label>
          <div className='inline-block relative w-44'>
            <select
              id='type'
              onChange={handleTypeSelection}
              className='block appearance-none w-full text-gray-700 bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 rounded shadow leading-tight focus:outline-none focus:shadow-outline'
            >
              <option value='progress'>Progress update</option>
              <option value='impact'>Impact update</option>
            </select>
            <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
              <svg
                className='fill-current h-4 w-4'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 20 20'
              >
                <path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
              </svg>
            </div>
          </div>
        </div>

        <div className='mb-4'>
          <label htmlFor='date' className='pb-2 block'>
            Date
          </label>
          <input
            type='date'
            id='date'
            className='block appearance-none w-full text-gray-700 bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 rounded shadow leading-tight focus:outline-none focus:shadow-outline'
          />
        </div>

        <div className='mb-4'>
          <label htmlFor='project' className='pb-2 block'>
            Project
          </label>
          <div className='inline-block relative w-40'>
            <select
              id='project'
              onChange={handleProjectSelection}
              className='block appearance-none w-full text-gray-700 bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline'
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
                className='fill-current h-4 w-4'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 20 20'
              >
                <path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
              </svg>
            </div>
          </div>
        </div>

        <div className='mb-4'>
          <label htmlFor='output' className='pb-2 block'>
            Output
          </label>
          <div className='inline-block relative w-full'>
            <select
              id='output'
              onChange={handleOutputSelection}
              className='block appearance-none w-full text-gray-700 bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline'
            >
              {projectOutputs.map((d) => {
                return (
                  <optgroup
                    key={d.id}
                    label={`${d.code}: ${
                      d.description.length >= 75
                        ? d.description.slice(0, 70) + '...'
                        : d.description
                    }`}
                    className='text-xs'
                  >
                    {d.output_measurables.map((om) => {
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
                className='fill-current h-4 w-4'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 20 20'
              >
                <path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className='mb-8'>
        <textarea
          id='description'
          rows={3}
          className='block appearance-none w-full text-gray-700 bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 rounded shadow leading-tight focus:outline-none focus:shadow-outline'
          placeholder='Add your update description here...'
        />
      </div>
      <div className='mb-4 flex justify-end items-end gap-4'>
        {updateType === 'impact' && (
          <>
            {/* <label htmlFor='impact' className='mr-2'>
              This update impacts
            </label> */}
            <div className='mb-4 basis-1/2 flex justify-end items-center'>
              <input
                type='number'
                id='impact'
                className='block appearance-none w-32 text-gray-700 bg-white border-l border-t border-b border-gray-400 hover:border-gray-500 pl-4 pr-2 py-2 rounded-l  leading-tight focus:outline-none focus:shadow-outline'
              />
              <p className='mr-2 block appearance-none text-gray-400 bg-white border-t border-b border-r border-gray-400 py-2 pl-2 pr-4 rounded-r leading-tight'>
                {selectedOutputUnit}
              </p>
            </div>
          </>
        )}

        <div className='mb-4 basis-1/2'>
          <label htmlFor='link' className='pb-2 block'>
            Link
          </label>
          <input
            type='text'
            id='link'
            placeholder='Add a link to the cold hard PROOF'
            className='block appearance-none w-full text-gray-700 bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 rounded shadow leading-tight focus:outline-none focus:shadow-outline'
          />
        </div>
      </div>
      <div className='mb-4 flex justify-end items-start gap-4'>
        <button
          type='submit'
          className='px-6 py-2 border border-foreground/50 rounded-md'
        >
          Add update
        </button>
      </div>
    </form>
  );
}
