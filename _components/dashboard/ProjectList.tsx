import { FetchProjectList } from '@/_utils/FetchProjectList';

interface Project {
  id: number;
  created_at: string;
  name: string;
}

export default async function Page() {
  const projects = await FetchProjectList();

  return (
    <div className='flex justify-start items-stretch gap-4'>
      {projects.map((project: Project) => (
        <div
          key={project.name}
          className='p-8 border rounded-lg min-h-[150px] min-w-[150px] flex flex-col justify-end items-end bg-gray-100 text-gray-500 text-sm dark:bg-gray-800 dark:text-slate-300'
        >
          <p>{project.name}</p>
        </div>
      ))}
    </div>
  );
}
