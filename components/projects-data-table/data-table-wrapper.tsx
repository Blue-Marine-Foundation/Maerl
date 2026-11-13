'use client';

import { useQuery } from '@tanstack/react-query';
import fetchProjectList from './fetch-project-list';
import { ProjectsDataTable } from './projects-data-table';
import { columns } from './columns';
import {
  isStaleActiveProject,
  staleThresholdDate,
} from '@/utils/stale-projects';

function toStaleProjects<
  T extends { project_status?: string | null; last_updated?: string | null },
>(projects: T[]): T[] {
  const threshold = staleThresholdDate();
  return projects
    .filter((p) => isStaleActiveProject(p, threshold))
    .sort((a, b) => {
      // Never-updated projects first, then oldest update first.
      if (!a.last_updated) return b.last_updated ? -1 : 0;
      if (!b.last_updated) return 1;
      return a.last_updated.localeCompare(b.last_updated);
    });
}

export default function ProjectsDataTableWrapper({
  staleOnly = false,
}: Readonly<{ staleOnly?: boolean }>) {
  const { data, error, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjectList,
  });

  if (error) {
    return (
      <div className='flex min-h-96 flex-col items-center justify-center gap-6 rounded-md bg-card p-12'>
        <p className='text-lg font-semibold'>Error loading projects</p>
        <p className='text-sm text-muted-foreground'>{error.message}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className='flex min-h-screen flex-col items-center justify-start gap-6 rounded-md bg-card p-28'>
        <p className='text-lg font-semibold'>Loading</p>
        <p className='text-sm text-muted-foreground'>
          Fetching all projects and units...
        </p>
      </div>
    );
  }

  if (!Array.isArray(data)) {
    return (
      <div className='flex min-h-96 flex-col items-center justify-center gap-6 rounded-md bg-card p-12'>
        <p className='text-lg font-semibold'>Error loading projects</p>
        <p className='text-sm text-muted-foreground'>Unexpected data format</p>
      </div>
    );
  }

  return (
    <ProjectsDataTable
      columns={columns}
      data={staleOnly ? toStaleProjects(data) : data}
    />
  );
}
