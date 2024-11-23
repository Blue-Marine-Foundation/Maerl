import ProjectsDataTableWrapper from '@/components/projects-data-table/data-table-wrapper';
import PageHeading from '@/components/ui/page-heading';

export default function ProtectedPage() {
  return (
    <div className='flex w-full flex-col gap-8'>
      <PageHeading>Projects</PageHeading>
      <ProjectsDataTableWrapper />
    </div>
  );
}
