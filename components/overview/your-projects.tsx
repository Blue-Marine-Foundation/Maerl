'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import * as d3 from 'd3';
import { ArrowRightIcon, PlusIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import ProjectStatusBadge from '@/components/ui/project-status-badge';
import {
  fetchYourProjects,
  type YourProjectRow,
  type YourProjectsScope,
} from './your-projects-server-actions';

function projectHref(p: YourProjectRow): string {
  return `/${p.project_type === 'Unit' ? 'units' : 'projects'}/${p.slug}`;
}

function addUpdateHref(p: YourProjectRow): string {
  return `/${p.project_type === 'Unit' ? 'units' : 'projects'}/${p.slug}/add-update`;
}

function ProjectRow({ project }: Readonly<{ project: YourProjectRow }>) {
  const lastUpdated = project.last_updated
    ? d3.timeFormat('%d %b %Y')(new Date(project.last_updated))
    : '—';

  return (
    <div className='flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0'>
      <div className='flex min-w-0 flex-col gap-1'>
        <Link
          href={projectHref(project)}
          className='truncate text-sm font-medium hover:underline'
        >
          {project.name ?? 'Untitled project'}
        </Link>
        <div className='flex items-center gap-2 text-xs text-muted-foreground'>
          {project.project_status && (
            <ProjectStatusBadge status={project.project_status} size='xs' />
          )}
          <span className='font-mono'>{lastUpdated}</span>
        </div>
      </div>
      <Link
        href={addUpdateHref(project)}
        className='flex items-center gap-1 whitespace-nowrap rounded-md border px-2 py-1 text-xs text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground'
      >
        <PlusIcon className='h-3 w-3' />
        Add update
      </Link>
    </div>
  );
}

export default function YourProjects({
  scope,
}: Readonly<{ scope: YourProjectsScope }>) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['overview-your-projects', scope],
    queryFn: () => fetchYourProjects(scope),
    staleTime: 5 * 60 * 1000,
  });

  const description =
    scope === 'partner'
      ? 'Projects where you support delivery — jump in to review progress or add an update.'
      : 'Projects you lead — pick up where you left off and keep indicators current.';

  return (
    <div className='flex h-full flex-col gap-4 rounded-lg border bg-card p-5'>
      <div>
        <h2 className='text-base font-semibold'>Your projects</h2>
        <p className='mt-1 text-xs text-muted-foreground'>{description}</p>
      </div>

      {error && (
        <p className='text-sm text-muted-foreground'>
          Failed to load: {(error as Error).message}
        </p>
      )}

      {isLoading && (
        <div className='flex flex-col gap-3'>
          <Skeleton className='h-10 w-full' />
          <Skeleton className='h-10 w-full' />
          <Skeleton className='h-10 w-full' />
        </div>
      )}

      {!isLoading && !error && data?.length === 0 && (
        <p className='text-sm text-muted-foreground'>
          No projects assigned to you yet.
        </p>
      )}

      {!isLoading && !error && data && data.length > 0 && (
        <>
          <div className='flex flex-col divide-y'>
            {data.map((project) => (
              <ProjectRow key={project.id} project={project} />
            ))}
          </div>
          <Link
            href='/projects'
            className='mt-auto flex items-center justify-end gap-2 pt-2 text-sm text-muted-foreground hover:text-foreground'
          >
            <span>View all projects</span>
            <ArrowRightIcon className='h-4 w-4' />
          </Link>
        </>
      )}
    </div>
  );
}
