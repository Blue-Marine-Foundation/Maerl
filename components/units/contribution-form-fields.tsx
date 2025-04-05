'use client';

import { Output, ProjectWithOutputs, OutputMeasurable } from '@/utils/types';
import { useState, useEffect } from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { cn } from '@/utils/cn';

// Create a context to manage which dropdown is open
import { createContext, useContext } from 'react';
import ActionButton from '../ui/action-button';

type DropdownContextType = {
  openDropdownId: string | null;
  setOpenDropdownId: (id: string | null) => void;
};

const DropdownContext = createContext<DropdownContextType>({
  openDropdownId: null,
  setOpenDropdownId: () => {},
});

export const DropdownProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  return (
    <DropdownContext.Provider value={{ openDropdownId, setOpenDropdownId }}>
      {children}
    </DropdownContext.Provider>
  );
};

export const ProjectSelect = ({
  projects,
  selectedProject,
  setSelectedProject,
}: {
  projects: ProjectWithOutputs[];
  selectedProject: ProjectWithOutputs | null;
  setSelectedProject: (project: ProjectWithOutputs | null) => void;
}) => {
  const { openDropdownId, setOpenDropdownId } = useContext(DropdownContext);
  const dropdownId = 'project-select';
  const isOpen = openDropdownId === dropdownId;

  const toggleDropdown = () => {
    setOpenDropdownId(isOpen ? null : dropdownId);
  };

  return (
    <div className='relative flex w-full flex-col rounded-md border'>
      <button
        className={cn(
          'flex items-center justify-between rounded-md bg-muted px-3 py-2',
          isOpen && 'rounded-b-none',
        )}
        onClick={toggleDropdown}
        type='button'
      >
        <span>
          {selectedProject ? selectedProject.name : 'Select Project:'}
        </span>
        <ChevronDownIcon className='h-4 w-4' />
      </button>
      {isOpen && (
        <div className='absolute left-0 right-0 top-full z-10 flex max-h-[320px] flex-col overflow-y-auto rounded-b-md border bg-black'>
          {projects
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((project) => (
              <label
                key={project.id}
                htmlFor={`project-${project.id}`}
                className='flex justify-start border-t px-3 hover:cursor-pointer hover:bg-sky-700/20'
              >
                <div className='p-4'>
                  <input
                    type='radio'
                    id={`project-${project.id}`}
                    name='project'
                    value={project.id}
                    checked={selectedProject?.id === project.id}
                    onChange={() => {
                      setSelectedProject(project);
                      setOpenDropdownId(null);
                    }}
                  />
                </div>
                <p className='w-full p-4'>{project.name}</p>
              </label>
            ))}
        </div>
      )}
    </div>
  );
};

export const OutputSelect = ({
  outputs,
  selectedOutput,
  setSelectedOutput,
  projectSlug,
}: {
  outputs: Output[];
  selectedOutput: Output | null;
  setSelectedOutput: (output: Output | null) => void;
  projectSlug?: string;
}) => {
  const { openDropdownId, setOpenDropdownId } = useContext(DropdownContext);
  const dropdownId = 'output-select';
  const isOpen = openDropdownId === dropdownId;

  const toggleDropdown = () => {
    setOpenDropdownId(isOpen ? null : dropdownId);
  };

  return (
    <>
      {outputs.length === 0 ? (
        <div className='flex max-w-2xl flex-col items-center justify-center gap-4 rounded-md border bg-muted p-8 text-center'>
          <p>Project has no outputs yet.</p>
          {projectSlug && (
            <a href={`/projects/${projectSlug}/theory-of-change`}>
              <ActionButton action='add' label='Add an output' />
            </a>
          )}
        </div>
      ) : (
        <div className='relative flex w-full max-w-2xl flex-col rounded-md border'>
          <button
            className={cn(
              'flex items-center justify-between rounded-md bg-muted px-3 py-2',
              isOpen && 'rounded-b-none',
            )}
            onClick={toggleDropdown}
            type='button'
          >
            <span>
              {selectedOutput
                ? `${selectedOutput.code}: ${selectedOutput.description.substring(0, 60)}${selectedOutput.description.length > 60 ? '...' : ''}`
                : 'Select Output:'}
            </span>
            <ChevronDownIcon className='h-4 w-4' />
          </button>
          {isOpen && (
            <div className='absolute left-0 right-0 top-full z-10 flex max-h-[350px] flex-col overflow-y-auto rounded-b-md border bg-black'>
              {outputs
                .sort((a, b) => a.code.localeCompare(b.code))
                .map((output) => (
                  <label
                    key={output.id}
                    htmlFor={`output-${output.id}`}
                    className='flex justify-start border-t px-3 hover:cursor-pointer hover:bg-sky-700/20'
                  >
                    <div className='p-4'>
                      <input
                        type='radio'
                        id={`output-${output.id}`}
                        name='output'
                        value={output.id}
                        checked={selectedOutput?.id === output.id}
                        onChange={() => {
                          setSelectedOutput(output);
                          setOpenDropdownId(null);
                        }}
                      />
                    </div>

                    <p className='w-24 p-4'>{output.code}</p>
                    <p className='w-full p-4'>{output.description}</p>
                  </label>
                ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export const OutputMeasurableCheckboxes = ({
  selectedOutput,
  selectedMeasurables,
  onMeasurablesChange,
}: {
  selectedOutput: Output | null;
  selectedMeasurables: number[];
  onMeasurablesChange: (measurableIds: number[]) => void;
}) => {
  if (!selectedOutput || !selectedOutput.output_measurables) return null;

  const handleCheckboxChange = (measurableId: number, checked: boolean) => {
    if (checked) {
      onMeasurablesChange([...selectedMeasurables, measurableId]);
    } else {
      onMeasurablesChange(
        selectedMeasurables.filter((id) => id !== measurableId),
      );
    }
  };

  return (
    <div className='flex w-full max-w-2xl flex-col rounded-md border'>
      <div className='flex items-center justify-between rounded-md bg-muted px-3 py-2'>
        <span className='text-sm font-medium'>
          Select all relevant output indicators:
        </span>
      </div>
      <div className='flex max-h-[350px] flex-col overflow-y-auto rounded-b-md border bg-black'>
        {selectedOutput.output_measurables
          .sort((a, b) => a.code.localeCompare(b.code))
          .map((measurable) => (
            <label
              key={measurable.id}
              htmlFor={`measurable-${measurable.id}`}
              className='flex justify-start border-t px-3 hover:cursor-pointer hover:bg-sky-700/20'
            >
              <div className='p-4'>
                <input
                  type='checkbox'
                  id={`measurable-${measurable.id}`}
                  checked={selectedMeasurables.includes(measurable.id || 0)}
                  onChange={(e) =>
                    handleCheckboxChange(measurable.id || 0, e.target.checked)
                  }
                  className='h-4 w-4 rounded border-gray-300'
                />
              </div>
              <p className='w-24 p-4'>{measurable.code}</p>
              <p className='w-full p-4'>{measurable.description}</p>
            </label>
          ))}
      </div>
    </div>
  );
};
