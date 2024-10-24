'use client';

import { ProjectMetadata } from '@/utils/types';
import EditDialogue from './edit-dialogue';
import { fetchProjectMetadata } from './server-actions';
import { useQuery } from '@tanstack/react-query';
import ProjectStatusBadge from '../ui/project-status-badge';

export default function ProjectMetadataDisplay({
  project,
}: {
  project: ProjectMetadata;
}) {
  const projectMetadataKeys = [
    { label: 'Project Manager', key: 'pm' },
    { label: 'Support', key: 'support' },
    { label: 'Start Date', key: 'start_date' },
    { label: 'Regional Strategy', key: 'regional_strategy' },
    { label: 'Units', key: 'unit_requirements' },
    { label: 'Pillars', key: 'pillars' },
    { label: 'Local Contacts', key: 'local_contacts' },
    { label: 'Highlights', key: 'highlights' },
    { label: 'Current Issues', key: 'current_issues' },
    { label: 'Proposed Solutions', key: 'proposed_solutions' },
    {
      label: 'Board Intervention Required',
      key: 'board_intervention_required',
    },
  ] as const;

  const renderValue = (key: keyof ProjectMetadata) => {
    const value = data[key];
    if (key === 'local_contacts' && Array.isArray(value)) {
      return (value as ProjectMetadata['local_contacts']).map(
        (contact, index) => (
          <p key={index}>
            {contact.name} - {contact.organisation}
          </p>
        ),
      );
    }
    return <p>{value as string}</p>;
  };

  const { data, error, isLoading } = useQuery<ProjectMetadata>({
    queryKey: ['projectMetadata', project.id],
    queryFn: async () => await fetchProjectMetadata(project.id),
    initialData: project,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className='flex flex-col gap-6 rounded-md bg-card p-4'>
      <div className='flex items-center justify-between gap-4'>
        <h3 className='text-sm font-semibold text-muted-foreground'>
          Project Metadata
        </h3>
        <EditDialogue project={data} />
      </div>
      <div className='flex flex-grow flex-col gap-4'>
        <div className='grid grid-cols-[170px_auto] gap-4 text-sm'>
          <p className='mb-1 text-sm text-foreground/80'>Project Status</p>
          <p>
            {data.project_status && (
              <ProjectStatusBadge status={data.project_status} />
            )}
          </p>
        </div>
        {projectMetadataKeys.map((key) => (
          <div
            className='grid grid-cols-[170px_auto] gap-4 text-sm'
            key={key.key}
          >
            <p className='mb-1 text-sm text-foreground/80'>{key.label}</p>
            <div className='text-foreground'>{renderValue(key.key)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
