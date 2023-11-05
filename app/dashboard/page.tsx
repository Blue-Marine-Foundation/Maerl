import ProjectList from '@/components/dashboard/ProjectList';

export default function Dashboard() {
  return (
    <>
      <div className='max-w-6xl mx-auto'>
        <h2 className='text-2xl font-bold mb-8'>Projects</h2>

        <ProjectList />
      </div>
    </>
  );
}
