'use client';

import { ProjectMetadata, ProjectWithOutputs, Output } from '@/utils/types';
import { useState, useEffect } from 'react';
import {
  ProjectSelect,
  OutputSelect,
  DropdownProvider,
  OutputMeasurableCheckboxes,
} from './contribution-form-fields';
import { addUnitContribution } from './server-actions';
import { Loader } from 'lucide-react';
import { cn } from '@/utils/cn';

export default function AddUnitContributionForm({
  projects,
  activeUnit,
}: {
  projects: ProjectWithOutputs[];
  activeUnit: ProjectMetadata;
}) {
  const [selectedProject, setSelectedProject] =
    useState<ProjectWithOutputs | null>(null);
  const [selectedOutput, setSelectedOutput] = useState<Output | null>(null);
  const [selectedMeasurables, setSelectedMeasurables] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setSelectedOutput(null);
    setSelectedMeasurables([]);
    setMessage(null);
    setError(false);
  }, [selectedProject]);

  useEffect(() => {
    if (message && !error) {
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  }, [message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(false);

    const contributions = selectedMeasurables.map((measurableId) => ({
      unit_id: activeUnit.id,
      output_measurable_id: measurableId,
    }));

    const { data, error } = await addUnitContribution(contributions);

    if (error) {
      setError(true);
      setMessage(`Error adding output: ${error.message}`);
    } else {
      setMessage('✅ Output added successfully');
    }

    setIsLoading(false);
    setSelectedMeasurables([]);
    setSelectedOutput(null);
  };

  // Check if form can be submitted
  const canSubmit = selectedMeasurables.length > 0;

  return (
    <DropdownProvider>
      <form
        onSubmit={handleSubmit}
        className='mx-auto flex min-h-[350px] w-full max-w-2xl flex-col gap-6 pb-8'
      >
        <ProjectSelect
          projects={projects}
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
        />

        {selectedProject && (
          <OutputSelect
            outputs={selectedProject.outputs}
            selectedOutput={selectedOutput}
            setSelectedOutput={setSelectedOutput}
            projectSlug={selectedProject.slug}
          />
        )}

        {selectedOutput && (
          <OutputMeasurableCheckboxes
            selectedOutput={selectedOutput}
            selectedMeasurables={selectedMeasurables}
            onMeasurablesChange={setSelectedMeasurables}
          />
        )}

        {canSubmit && (
          <button
            type='submit'
            className={`flex w-full max-w-xs items-center justify-center gap-2 rounded-md px-4 py-2 text-sm text-white ${
              canSubmit
                ? 'bg-sky-500/50 transition-all duration-300 hover:bg-sky-500/70'
                : 'cursor-not-allowed bg-gray-400'
            }`}
            disabled={isLoading}
          >
            {isLoading ? <Loader className='animate-spin' /> : 'Add output'}
          </button>
        )}

        {message && (
          <p
            className={cn(
              'rounded border p-3',
              error ? 'bg-rose-500/10' : 'bg-green-500/10',
            )}
          >
            {message}
          </p>
        )}
      </form>
    </DropdownProvider>
  );
}
