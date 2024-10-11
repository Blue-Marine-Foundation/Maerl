import ProjectsQueryWrapper from '@/components/projects-data-table/query-wrapper';
import PageHeading from '@/components/ui/page-heading';

export default async function ProtectedPage() {
  return (
    <div className='flex w-full flex-col gap-8'>
      <PageHeading>Projects</PageHeading>
      <ProjectsQueryWrapper />
    </div>
  );
}
