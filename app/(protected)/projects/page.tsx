import ProjectsDirectory from '@/components/projects/projects-directory';
import PageHeading from '@/components/ui/page-heading';

export default function ProtectedPage() {
  return (
    <div className='flex w-full flex-col gap-6'>
      <div className='flex max-w-2xl flex-col gap-2'>
        <PageHeading>Projects</PageHeading>
        <p className='text-sm text-muted-foreground'>
          The project directory — browse every programme in the table, or explore
          geography on the map.
        </p>
      </div>
      <ProjectsDirectory />
    </div>
  );
}
