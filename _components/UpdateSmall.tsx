import Link from 'next/link';
import Tooltip from './Tooltip';
import { Update } from '@/_lib/types';
import dayjs from 'dayjs';

export default function UpdateSmall({ update }: { update: Update }) {
  return (
    <div className='text-white text-sm px-5 py-4 bg-card-bg border-b first-of-type:pt-5 first-of-type:rounded-t-lg last-of-type:border-b-transparent last-of-type:rounded-b-lg last-of-type:pb-5 shadow'>
      <div className='flex gap-4 text-foreground/70 text-xs font-mono mb-2'>
        <p>{dayjs(update.date).format('DD MMM')}</p>/
        <Tooltip
          tooltipContent={update.output_measurables?.description}
          tooltipWidth={380}
          tooltipDirection='left'
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
            tooltipDirection='left'
          >
            {update.output_measurables.impact_indicators.indicator_code}
          </Tooltip>
        ) : (
          <span>Progress</span>
        )}
      </div>

      <p className='text-sm max-w-md'>{update.description}</p>
    </div>
  );
}
