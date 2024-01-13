import Link from 'next/link';
import { Project, UpdateNested } from '@/_lib/types';
import dayjs from 'dayjs';

export default function UpdateMediumNested({
  update,
  project,
}: {
  update: UpdateNested;
  project?: Project;
}) {
  return (
    <div className='text-white text-sm p-4 flex justify-between items-baseline gap-6 bg-card-bg border-b first-of-type:pt-5 first-of-type:rounded-t-lg last-of-type:border-b-transparent last-of-type:rounded-b-lg shadow'>
      {project && (
        <Link
          style={{ background: project.highlight_color }}
          href={`/app/projects/${project.slug}`}
          className='py-1 px-2 text-xs text-background rounded-md'
        >
          {project.name}
        </Link>
      )}

      <div className='grow'>
        <p className='text-sm max-w-md'>{update.description}</p>
        <div className='flex gap-2'></div>
      </div>
      <div className='flex gap-4 text-xs font-mono'>
        <p className='text-foreground/70'>
          {dayjs(update.date).format('DD MMM')}
        </p>
        /
        <div className='text-foreground/70 flex gap-0.5'>
          <p>
            <Link href={`/`} className='hover:underline'>
              Output
            </Link>
          </p>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='12'
            height='12'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='-mt-0.5'
          >
            <path d='M7 7h10v10' />
            <path d='M7 17 17 7' />
          </svg>
        </div>
      </div>
    </div>
  );
}
