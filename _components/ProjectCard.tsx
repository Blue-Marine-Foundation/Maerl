import { PRODUCTION_URL } from '@/lib/constants';
import { Project, Output } from '@/lib/types';
import dayjs from 'dayjs';
import Link from 'next/link';

export default async function ProjectCard({ project }: { project: Project }) {
  const completeOutputs =
    project.outputs?.filter((output: Output) => output.status === 'Complete') ||
    [];

  const updates = project.updates
    ? project.updates.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )
    : null;

  return (
    <Link
      key={project.name}
      href={`${PRODUCTION_URL}/app/projects/${project.slug}`}
      className='px-6 py-4 bg-card-bg hover:bg-card-bg/60 first-of-type:rounded-t-xl last-of-type:rounded-b-xl flex justify-start items-center group border-b last-of-type:border-b-transparent transition-all'
    >
      <div className='w-24 shrink-0'>
        <span
          style={{ background: project.highlight_color }}
          className='flex justify-center items-center w-10 h-10 font-semibold text-background rounded-md'
        >
          {project.id}
        </span>
      </div>

      <div className='w-[280px]'>
        <h3 className='text-lg font-bold mb-0.5'>{project.name}</h3>
        <p className='text-sm text-foreground/80'>
          {project.lead_partner && project.lead_partner}
        </p>
      </div>

      <div className='text-sm text-foreground/90 flex justify-start items-center gap-8'>
        <p className='w-[200px]'>
          {updates &&
            updates.length > 0 &&
            `Last updated ${dayjs(updates[0].date).format("DD MMM 'YY")}`}
        </p>
        <p className='w-[120px]'>
          {updates &&
            `${updates.length} update${updates.length != 1 ? 's' : ''}`}
        </p>
        <p className='w-[180px]'>{`${completeOutputs.length}/${
          project.outputs ? project.outputs.length : 'N/A'
        } outputs complete`}</p>
      </div>

      <div className='grow pr-8 group-hover:pr-4 transition-all text-xl text-right rounded-md'>
        <span className=''>&rarr;</span>
      </div>
    </Link>
  );
}
