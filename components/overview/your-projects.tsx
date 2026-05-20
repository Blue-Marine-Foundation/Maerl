'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { differenceInDays, formatDistanceToNow } from 'date-fns';
import { ArrowRightIcon, PlusIcon } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Skeleton } from '@/components/ui/skeleton';
import OverviewSectionHeader from './overview-section-header';
import {
  fetchYourProjects,
  type YourProjectRow,
  type YourProjectsScope,
} from './your-projects-server-actions';

const STALE_UPDATE_DAYS = 30;

function projectHref(p: YourProjectRow): string {
  return `/${p.project_type === 'Unit' ? 'units' : 'projects'}/${p.slug}`;
}

function addUpdateHref(p: YourProjectRow): string {
  return `/${p.project_type === 'Unit' ? 'units' : 'projects'}/${p.slug}/add-update`;
}

function statusLabel(status: string | null): string {
  if (!status) return 'Unknown status';
  return status.trim().replace(/\s+$/, '');
}

function isActiveStatus(status: string | null): boolean {
  return status?.toLowerCase().startsWith('active') ?? false;
}

function lastUpdateMeta(iso: string | null): {
  label: string;
  stale: boolean;
} {
  if (!iso) {
    return { label: 'No updates recorded', stale: true };
  }
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return { label: 'Update date unknown', stale: false };
  }
  const days = differenceInDays(new Date(), date);
  const stale = days > STALE_UPDATE_DAYS;
  const label = `Last update ${formatDistanceToNow(date, { addSuffix: true })}`;
  return { label, stale };
}

function indicatorMeta(count: number): string {
  if (count === 0) return 'No indicators with data yet';
  if (count === 1) return '1 indicator';
  return `${count.toLocaleString()} indicators`;
}

function ProjectCard({ project }: Readonly<{ project: YourProjectRow }>) {
  const { label: lastUpdateLabel, stale } = lastUpdateMeta(project.last_updated);
  const status = statusLabel(project.project_status);

  return (
    <article className='flex flex-col gap-4 rounded-xl border border-border/80 bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:gap-6'>
      <div className='min-w-0 flex-1'>
        <p className='text-sm font-semibold leading-snug text-foreground'>
          {project.name ?? 'Untitled project'}
        </p>
        <p className='mt-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-muted-foreground'>
          {isActiveStatus(project.project_status) ? (
            <>
              <span className='inline-flex items-center gap-1'>
                <span
                  className='h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500'
                  aria-hidden
                />
                <span>{status}</span>
              </span>
              <span aria-hidden>·</span>
            </>
          ) : (
            <>
              <span>{status}</span>
              <span aria-hidden>·</span>
            </>
          )}
          <span
            className={cn(stale && 'font-medium text-amber-600 dark:text-amber-500')}
          >
            {lastUpdateLabel}
          </span>
          <span aria-hidden>·</span>
          <span>{indicatorMeta(project.indicatorCount)}</span>
        </p>
      </div>
      <div className='flex shrink-0 items-center gap-2'>
        <Link
          href={addUpdateHref(project)}
          className='inline-flex items-center gap-1 rounded-md bg-primary px-2.5 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90'
        >
          <PlusIcon className='h-3 w-3' />
          Add update
        </Link>
        <Link
          href={projectHref(project)}
          className='inline-flex items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted/60'
        >
          View
          <ArrowRightIcon className='h-3 w-3' />
        </Link>
      </div>
    </article>
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

  const projectCount = data?.length ?? 0;
  const showViewAll = projectCount > 1;

  return (
    <section className='flex flex-col gap-4'>
      <OverviewSectionHeader
        title='Your projects'
        viewAllHref={showViewAll ? '/projects' : undefined}
        viewAllLabel={showViewAll ? 'View all projects' : undefined}
      />

      {error && (
        <p className='text-sm text-muted-foreground'>
          Failed to load: {(error as Error).message}
        </p>
      )}

      {isLoading && (
        <div className='flex flex-col gap-4'>
          <Skeleton className='h-[4.5rem] w-full rounded-xl' />
          <Skeleton className='h-[4.5rem] w-full rounded-xl' />
        </div>
      )}

      {!isLoading && !error && projectCount === 0 && (
        <p className='text-sm text-muted-foreground'>
          No projects assigned to you yet.
        </p>
      )}

      {!isLoading && !error && data && data.length > 0 && (
        <div className='flex flex-col gap-4'>
          {data.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </section>
  );
}
