import { createClient } from '@/_utils/supabase/server';
import Link from 'next/link';
import UpdateMedium from '@/_components/UpdateMedium';

export default async function Overview() {
  const supabase = createClient();

  const { data: updates, error } = await supabase
    .from('updates')
    .select('*, projects (*), output_measurables (*, impact_indicators (*))')
    .order('date', { ascending: false })
    .limit(25);

  if (error) {
    console.log(`Failed to fetch projects: ${error.message}`);
  }

  // @ts-ignore
  const project_list = updates
    .reduce((acc, u) => {
      const projectKey = u.projects.id; // Assuming id is unique for each project
      if (!acc.has(projectKey)) {
        acc.set(projectKey, {
          name: u.projects.name,
          id: projectKey,
          color: u.projects.highlight_color,
          slug: u.projects.slug,
        });
      }
      return acc;
    }, new Map())
    .values();

  interface Project {
    name: string;
    id: number;
    slug: string;
    color: string;
  }

  const uniqueProjectsArray: Project[] = Array.from(project_list);

  return (
    <div className='animate-in'>
      <div className='flex justify-between gap-16'>
        <div className='py-4 basis-1/4'>
          <div className='flex justify-between items-baseline'>
            <h3 className='text-lg font-bold mb-6'>Recent projects</h3>
            <p className='text-sm pr-1'>
              <Link
                href='/app/projects'
                className='text-foreground/80 underline hover:text-foreground'
              >
                View all
              </Link>
            </p>
          </div>

          {uniqueProjectsArray.map((project) => {
            return (
              <Link
                href={`/app/projects/${project.slug}`}
                key={project.name}
                className='p-4 flex justify-between items-center group first-of-type:pt-5 last-of-type:pb-5 first-of-type:rounded-t-lg last-of-type:rounded-b-lg bg-card-bg hover:bg-card-bg/60 text-slate-100 border border-transparent border-b-foreground/20 last-of-type:border-b-transparent transition-all duration-300'
              >
                <span
                  style={{ background: project.color }}
                  className='mr-4 flex justify-center items-center w-8 h-8 text-sm text-background rounded-md'
                >
                  {project.id}
                </span>
                <p className='grow'>
                  {`${project.name.slice(0, 18)}${
                    project.name.length > 20 ? '...' : ''
                  }`}
                </p>
                <p className='w-12 text-right transition-all duration-300 pr-4 group-hover:pr-1'>
                  &rarr;
                </p>
              </Link>
            );
          })}
        </div>
        <div className='pt-4 pb-24 basis-3/4'>
          <h3 className='text-lg font-bold mb-6'>Latest updates</h3>
          {updates &&
            updates.map((u) => {
              return <UpdateMedium key={u.id} update={u} />;
            })}
        </div>
      </div>
    </div>
  );
}
