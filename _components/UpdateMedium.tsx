import Link from 'next/link';
import Tooltip from './Tooltip';
import { Update } from '@/_lib/types';
import dayjs from 'dayjs';

export default function UpdateMedium({ update }: { update: Update }) {
  return (
    <div className='text-white text-sm p-4 flex justify-between items-baseline gap-8 bg-card-bg border-b first-of-type:pt-5 first-of-type:rounded-t-lg last-of-type:border-b-transparent last-of-type:rounded-b-lg shadow'>
      <div className='w-[150px] shrink-0'>
        <Link
          href={`/app/projects/${update.projects.slug}`}
          className='flex items-center gap-4 mb-1'
        >
          <span
            className='h-2 w-2 rounded-full'
            style={{ background: update.projects.highlight_color }}
          ></span>
          {`${update.projects.name.slice(0, 14)}${
            update.projects.name.length > 20 ? '...' : ''
          }`}
        </Link>
        <p className='pl-6 text-xs text-foreground/70'>
          {update.date
            ? dayjs(update.date).format('DD MMM YY')
            : 'Date unknown'}
        </p>
      </div>
      <div className='w-[160px] shrink-0'>
        {update.output_measurable_id && (
          <p className='mb-1'>
            <Tooltip
              tooltipContent={update.output_measurables?.description}
              tooltipWidth={380}
              tooltipDirection='left'
            >
              Output {update.output_measurables.code}
            </Tooltip>{' '}
          </p>
        )}

        {update.output_measurables?.impact_indicators?.indicator_code ? (
          <p className='text-xs text-foreground/70'>
            <Tooltip
              tooltipContent={
                update.output_measurables.impact_indicators.indicator_title
              }
              tooltipWidth={380}
              tooltipDirection='left'
            >
              Impact indicator{' '}
              {update.output_measurables.impact_indicators.indicator_code}
            </Tooltip>
          </p>
        ) : (
          <p>Progress update</p>
        )}
      </div>
      <div className='grow pr-4'>
        <p>{update.description}</p>
      </div>
    </div>
  );
}
