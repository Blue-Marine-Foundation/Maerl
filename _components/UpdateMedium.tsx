import Link from 'next/link';
import Tooltip from './Tooltip';
import { Update } from '@/_lib/types';
import dayjs from 'dayjs';

export default function UpdateMedium({ update }: { update: Update }) {
  return (
    <div className='text-white text-sm p-4 flex justify-between items-baseline gap-4 bg-card-bg border-b first-of-type:pt-5 first-of-type:rounded-t-lg last-of-type:border-b-transparent last-of-type:rounded-b-lg shadow'>
      <div className='w-[120px]'>
        <Link
          style={{ background: update.projects.highlight_color }}
          href={`/app/projects/${update.projects.slug}`}
          className='py-1 px-2 text-xs text-background rounded-md'
        >
          {update.projects.name}
        </Link>
      </div>
      <div className='grow'>
        <p className='text-sm max-w-md'>{update.description}</p>
        <div className='flex gap-2'></div>
      </div>
      <div className='flex gap-4 text-xs font-mono'>
        <p className='text-foreground/70'>
          {dayjs(update.date).format('DD MMM')}
        </p>
        /
        <Tooltip
          tooltipContent={update.output_measurables?.description}
          tooltipWidth={380}
        >
          {update.output_measurables.code}
        </Tooltip>{' '}
        /
        {update.output_measurables?.impact_indicators?.indicator_code ? (
          <Tooltip
            tooltipContent={
              update.output_measurables.impact_indicators.indicator_title
            }
            tooltipWidth={380}
          >
            {update.output_measurables.impact_indicators.indicator_code}
          </Tooltip>
        ) : (
          <span>Progress</span>
        )}
      </div>
    </div>
  );
}
