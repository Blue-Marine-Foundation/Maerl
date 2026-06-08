import ProjectsDirectory from '@/components/projects/projects-directory';
import PageHeading from '@/components/ui/page-heading';

export default function ProtectedPage() {
  return (
    <div className='flex w-full flex-col gap-6'>
      <div className='flex max-w-2xl flex-col gap-2'>
        <PageHeading>Projects</PageHeading>
        <p className='text-sm text-muted-foreground'>
          Explore project geographies on the map, or switch to the table for the
          full directory.
        </p>
      </div>
      <ProjectsDirectory />
    </div>
  );
}
