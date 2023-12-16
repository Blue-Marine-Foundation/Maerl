import { createClient } from '@/_utils/supabase/server';
import { PRODUCTION_URL } from '@/lib/constants';
import { Project, Output } from '@/lib/types';
import Link from 'next/link';

export default async function Page() {
  const supabase = createClient();

  const { data: projects, error } = await supabase
    .from('projects')
    .select('*, outputs (*), updates (*)');

  if (error) {
    throw new Error(`Failed to fetch projects: ${error.message}`);
  }

  return (
    <div className='flex gap-8'>
      <div className='py-4 mb-16 border-t basis-5/6'>
        {projects
          .sort((a: Project, b: Project) => a.name.localeCompare(b.name))
          .map((project: Project) => {
            const completeProjects =
              project.outputs?.filter(
                (output: Output) => output.status === 'Complete'
              ) || [];
            const numberCompleteProjects = completeProjects.length;
            return (
              <Link
                key={project.name}
                href={`${PRODUCTION_URL}/app/projects/${project.slug}`}
                className='mb-4 px-4 pt-4 pb-5 bg-card-bg rounded-lg flex justify-start items-center group border border-transparent hover:border-foreground/30 transition-all'
              >
                <div className='w-32'>
                  <span
                    style={{ background: project.highlight_color }}
                    className='flex justify-center items-center w-20 h-20 text-lg text-background rounded-md'
                  >
                    {project.id}
                  </span>
                </div>
                <div>
                  <h3 className='text-xl font-bold mb-4'>{project.name}</h3>
                  <div>
                    <div className='text-xs text-foreground/80 font-mono flex justify-start items-center gap-8'>
                      <p className='w-[200px]'>
                        {project.lead_partner && project.lead_partner}
                      </p>
                      <p className='w-[200px]'>{`${completeProjects.length}/${
                        project.outputs ? project.outputs.length : 'N/A'
                      } outputs complete`}</p>
                      <p className='w-[200px]'>
                        {project.funders &&
                          `${project.funders.length} funder${
                            project.funders.length > 1 ? 's' : ''
                          }`}
                      </p>
                    </div>
                  </div>
                </div>
                <div className='grow text-2xl text-right rounded-md'>
                  <span className='pr-16 group-hover:pr-12 transition-all'>
                    &rarr;
                  </span>
                </div>
              </Link>
            );
          })}
      </div>
    </div>
  );
}
