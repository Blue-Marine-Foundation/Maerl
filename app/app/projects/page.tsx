import ProjectCard from '@/_components/ProjectCard';
import { createClient } from '@/_utils/supabase/server';
import { Project, Output } from '@/lib/types';

export default async function Projects() {
  const supabase = createClient();

  const { data: projects, error } = await supabase
    .from('projects')
    .select('*, outputs (*), updates (*)');

  console.log(projects?.length);

  return (
    <div className='animate-in pt-4 pb-24'>
      <h2 className='text-2xl font-bold mb-6'>Projects</h2>
      {error && <p>Error fetching projects from database: {error.message}</p>}
      {projects &&
        projects
          .sort((a: Project, b: Project) => a.name.localeCompare(b.name))
          .map((project: Project) => {
            return <ProjectCard key={project.name} project={project} />;
          })}
    </div>
  );
}
