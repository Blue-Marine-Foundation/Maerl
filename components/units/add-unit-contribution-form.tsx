'use client';

import { ProjectMetadata, ProjectWithOutputs, Output } from '@/utils/types';
import { useState } from 'react';
export default function AddUnitContributionForm({
  projects,
}: {
  projects: ProjectWithOutputs[];
  activeUnit: ProjectMetadata;
}) {
  const [selectedProject, setSelectedProject] =
    useState<ProjectWithOutputs | null>(null);

  const [selectedOutput, setSelectedOutput] = useState<Output | null>(null);

  return (
    <div>
      <form
        action={() => console.log('submitted')}
        className='flex flex-col gap-6'
      >
        {/* ********************************** Select project ********************************** */}

        <div className='flex items-center gap-8'>
          <label className='w-40 text-right' htmlFor='project'>
            Project:
          </label>
          <select
            name='project'
            id='project'
            value={selectedProject?.id}
            className='w-full max-w-lg rounded-md border bg-muted px-3 py-2 text-sm'
            onChange={(e) => {
              const project = projects.find(
                (p) => p.id === Number(e.target.value),
              );
              if (project) {
                setSelectedProject(project);
              }
            }}
          >
            <option value=''>Select project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        {/* ********************************** Select output ********************************** */}

        <div className='flex items-center gap-8'>
          <label className='w-40 text-right' htmlFor='output'>
            Output:
          </label>
          <select
            name='output'
            id='output'
            value={selectedOutput?.id}
            className='w-full max-w-lg rounded-md border bg-muted px-3 py-2 text-sm'
            onChange={(e) => {
              const output = selectedProject?.outputs.find(
                (o) => o.id === Number(e.target.value),
              );
              if (output) {
                setSelectedOutput(output);
              }
            }}
          >
            <option value=''>Select output</option>
            {selectedProject?.outputs.map((output) => (
              <option key={output.id} value={output.id}>
                {output.description}
              </option>
            ))}
          </select>
        </div>

        <button
          type='submit'
          className='ml-48 w-full max-w-xs rounded-md bg-pink-500 px-4 py-2 text-sm text-white'
        >
          Go
        </button>
      </form>
    </div>
  );
}
