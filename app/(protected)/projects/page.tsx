import ProjectsDirectory from '@/components/projects/projects-directory';
import PageHeading from '@/components/ui/page-heading';
import { STALE_PROJECTS_FILTER } from '@/utils/stale-projects';

export default async function ProtectedPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<{ filter?: string | string[] }>;
}>) {
  const { filter } = await searchParams;
  const staleOnly = filter === STALE_PROJECTS_FILTER;

  return (
    <div className='flex w-full flex-col gap-6'>
      <div className='flex max-w-2xl flex-col gap-2'>
        <PageHeading>Projects</PageHeading>
        <p className='text-sm text-muted-foreground'>
          Explore project geographies on the map, then use the directory below
          for filtering, export, and detail links.
        </p>
      </div>
      <ProjectsDirectory staleOnly={staleOnly} />
    </div>
  );
}
