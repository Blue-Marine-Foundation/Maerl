import { getProjectList } from '@/lib/databasehelpers';
import { PRODUCTION_URL } from '@/lib/constants';
import Link from 'next/link';

interface Project {
  id: number;
  created_at: string;
  name: string;
}

export default async function Page() {
  const projects = await getProjectList();

  return (
    <div className='flex justify-start items-stretch gap-4'>
      {projects.map((project: Project) => (
        <Link
          key={project.name}
          href={`${PRODUCTION_URL}/dashboard/project/${project.name}`}
          className='p-8 font-bold border rounded-lg min-h-[200px] min-w-[250px] flex flex-col justify-end items-end bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-slate-100'
        >
          <p>{project.name} &nbsp; &rarr;</p>
        </Link>
      ))}
    </div>
  );
}
