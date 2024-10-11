'use client';

import { useQuery } from '@tanstack/react-query';
// import { ProjectsDataTable } from './projects-data-table';
// import { columns } from '@/components/projects-data-table/columns';
import fetchProjectList from './fetch-project-list';

export default function ProjectsDataTableWrapper() {
  const { data, error, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjectList,
  });

  if (error)
    return (
      <div className='flex min-h-96 flex-col items-center justify-center gap-6 rounded-md bg-card p-12'>
        <p className='text-lg font-semibold'>Error loading projects</p>
        <p className='text-sm text-muted-foreground'>{error.message}</p>
      </div>
    );

  if (isLoading)
    return (
      <div className='flex min-h-96 flex-col items-center justify-center gap-6 rounded-md bg-card p-12'>
        <p className='text-lg font-semibold'>Loading</p>
        <p className='text-sm text-muted-foreground'>
          Fetching all projects and workstreams...
        </p>
      </div>
    );

  if (!Array.isArray(data))
    return (
      <div className='flex min-h-96 flex-col items-center justify-center gap-6 rounded-md bg-card p-12'>
        <p className='text-lg font-semibold'>Error loading projects</p>
        <p className='text-sm text-muted-foreground'>Unexpected data format</p>
      </div>
    );

  // return <ProjectsDataTable columns={columns} data={data} />;

  return (
    <div className='flex min-h-96 flex-col items-center justify-center gap-6 rounded-md bg-card p-6'>
      <div className='flex w-full flex-col gap-2'>
        {data.map((project) => (
          <p key={project.id}>{project.name}</p>
        ))}
      </div>
    </div>
  );
}
