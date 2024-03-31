import Link from 'next/link';
import Tooltip from './Tooltip';
import { Update } from '@/_lib/types';
import dayjs from 'dayjs';

export default function UpdateLarge({ update }: { update: Update }) {
  return (
    <div className='text-white text-sm p-4 flex justify-between items-baseline gap-8 bg-card-bg border-b first-of-type:pt-5 first-of-type:rounded-t-lg last-of-type:border-b-transparent last-of-type:rounded-b-lg shadow'>
      <div className='w-[190px] shrink-0'>
        <Link
          href={`/app/projects/${update.projects.slug}`}
          className='flex items-center gap-4 mb-1'
        >
          <span
            className='h-2 w-2 rounded-full'
            style={{ background: update.projects.highlight_color }}
          ></span>
          {update.projects.name}
        </Link>
        <p className='pl-6 text-xs text-foreground/70'>
          {update.date
            ? dayjs(update.date).format('DD MMM YY')
            : 'Date unknown'}
        </p>
      </div>
      <div className='w-[150px]'>
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

        <p className='text-xs text-foreground/70'>
          {update.output_measurables?.impact_indicators?.indicator_code &&
          update.output_measurables?.impact_indicators?.id < 900 ? (
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
          ) : (
            'Progress update'
          )}
        </p>
      </div>
      <div className='grow'>
        <p className='max-w-lg overflow-clip'>{update.description}</p>
      </div>
      <div className='w-[200px]'>
        {update.output_measurable_id && update.value && (
          <>
            <p className='mb-2'>{update.value}</p>
            <p className='text-xs text-foreground/70'>
              {update.output_measurables.impact_indicators.indicator_unit}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
