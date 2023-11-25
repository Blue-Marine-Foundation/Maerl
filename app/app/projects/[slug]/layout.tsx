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
  return (
    <>
      <div className='flex justify-start items-center gap-4 pb-6 border-b border-foreground/10'>
        <p className='w-10 h-10 flex justify-center items-center text-lg font-bold border rounded-md bg-slate-800'>
          {params.slug[0]}
        </p>
        <h2 className='text-2xl font-bold'>{params.slug}</h2>
      </div>
      <div className='flex'>
        <div className='pt-8 basis-1/5 border-r border-foreground/10'>
          <ProjectSideNav project={params.slug} />
        </div>
        <div className='pt-8 pb-16 pl-8 basis-4/5'>{children}</div>
      </div>
    </>
  );
}
