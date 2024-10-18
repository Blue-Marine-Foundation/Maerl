import { ProjectMetadata } from '@/utils/types';

export default function ProjectMetadataDisplay({
  project,
}: {
  project: ProjectMetadata;
}) {
  const projectMetadataKeys = [
    {
      label: 'Project Manager',
      key: 'pm',
    },
    {
      label: 'Support',
      key: 'support',
    },
    {
      label: 'Start Date',
      key: 'start_date',
    },
    {
      label: 'Regional Strategy',
      key: 'regional_strategy',
    },
    {
      label: 'Units',
      key: 'unit_requirements',
    },
    {
      label: 'Pillars',
      key: 'pillars',
    },
    {
      label: 'Local Contacts',
      key: 'local_contacts',
    },
    {
      label: 'Highlights',
      key: 'highlights',
    },
    {
      label: 'Current Issues',
      key: 'current_issues',
    },
    {
      label: 'Proposed Solutions',
      key: 'proposed_solutions',
    },
    {
      label: 'Board Intervention Required',
      key: 'board_intervention_required',
    },
  ];

  return (
    <div className='flex flex-grow flex-col gap-4'>
      <div className='grid grid-cols-[170px_auto] gap-4 text-sm'>
        <p className='mb-1 text-sm text-foreground/80'>Project Status</p>
        <p>
          <span
            className={`rounded-md px-3 py-1 text-sm font-light tracking-wide ${
              project.project_status === 'Active' &&
              'bg-green-500/15 text-green-500'
            } ${
              project.project_status === 'Pipeline' &&
              'bg-yellow-500/15 text-yellow-400'
            } ${
              project.project_status === 'Complete' &&
              'bg-blue-500/15 text-blue-400'
            } }`}
          >
            {project.project_status}
          </span>
        </p>
      </div>
      {projectMetadataKeys.map((key) => (
        <div
          className='grid grid-cols-[170px_auto] gap-4 text-sm'
          key={key.key}
        >
          <p className='mb-1 text-sm text-foreground/80'>{key.label}</p>
          <p className='text-foreground'>
            {project[key.key as keyof typeof project]}
          </p>
        </div>
      ))}
    </div>
  );
}
