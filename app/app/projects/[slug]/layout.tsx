import { createClient } from '@/_utils/supabase/server';
import ProjectSideNav from '@/_components/SideNav/ProjectSideNav';
import { Params } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Params;
}) {
  const supabase = createClient();

  const { data: project, error } = await supabase
    .from('projects')
    .select('*, outputs (*), updates (*)')
    .eq('slug', params.slug)
    .single();

  console.log(project);

  return (
    <>
      <div className='flex justify-between items-center pt-4 pb-8 border-b border-foreground/10'>
        {project ? (
          <>
            <div className='basis-2/5 flex justify-start items-center gap-6'>
              <span
                style={{
                  background: project.highlight_color,
                }}
                className='flex justify-center items-center w-10 h-10 text-lg font-bold text-background rounded-md'
              >
                {project.id}
              </span>
              <h2 className='text-2xl font-bold'>{project.name}</h2>
            </div>
            <div className='basis-3/5 pl-8 flex justify-end items-center gap-8 text-xs font-mono text-foreground/80'>
              <p className='px-2 py-1 rounded bg-green-300 text-card-bg'>
                Last updated{' '}
                {project.updates.length > 0
                  ? project.updates.at(-1).created_at.slice(0, 10)
                  : 'never'}
              </p>
              <p className='px-2 py-1 rounded bg-pink-300 text-card-bg'>
                {project.outputs.length} outputs
              </p>
              <p className='px-2 py-1 rounded bg-purple-300 text-card-bg'>
                {project.updates.length} updates
              </p>
            </div>
          </>
        ) : (
          <h2 className='text-2xl font-bold'>{params.slug}</h2>
        )}
      </div>
      <div className='flex items-stretch'>
        <div className='pt-8 pr-8 basis-1/5 border-r border-foreground/10 pb-24'>
          <ProjectSideNav project={params.slug} />
        </div>
        <div className='pt-8 pb-16 pl-8 basis-4/5'>{children}</div>
      </div>
    </>
  );
}
