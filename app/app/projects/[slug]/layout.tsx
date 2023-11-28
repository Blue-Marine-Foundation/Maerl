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
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*, outputs (*), updates (*)')
    .eq('name', params.slug);

  return (
    <>
      <div className='flex justify-start items-center pt-4 pb-8 border-b border-foreground/10'>
        {projects ? (
          <>
            <div className='basis-1/5 flex justify-start items-center gap-6'>
              <span
                style={{ background: projects[0].highlight_color }}
                className='flex justify-center items-center w-10 h-10 text-lg font-bold text-background rounded-md'
              >
                {projects[0].id}
              </span>
              <h2 className='text-2xl font-bold'>{params.slug}</h2>
            </div>
            <div className='basis-4/5 pl-8 flex justify-start items-center gap-8 text-xs font-mono text-foreground/80'>
              <p className='px-2 py-1 rounded bg-green-300 text-card-bg'>
                Last updated{' '}
                {projects[0].updates.at(-1).created_at.slice(0, 10)}
              </p>
              <p className='px-2 py-1 rounded bg-pink-300 text-card-bg'>
                {projects[0].outputs.length} outputs
              </p>
              <p className='px-2 py-1 rounded bg-purple-300 text-card-bg'>
                {projects[0].updates.length} updates
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
