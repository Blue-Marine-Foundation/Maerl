import { Update } from '@/utils/types';
import Link from 'next/link';
import * as d3 from 'd3';

export default function UpdatesListLarge({ updates }: { updates: Update[] }) {
  return (
    <div className='flex grow flex-col'>
      {updates?.map((update) => (
        <div
          className='grid grid-cols-[200px_200px_1fr_1fr] items-baseline gap-12 border-t py-6 first:border-t-0 first:pt-0 hover:bg-muted/50'
          key={update.id}
        >
          <div className='flex flex-col gap-2'>
            <Link
              className='max-w-48 truncate text-sm font-medium hover:underline'
              href={`/projects/${update.projects?.slug}`}
            >
              {update.projects?.name}
            </Link>
            <span className='text-xs text-muted-foreground'>
              {d3.timeFormat('%d %b %Y')(new Date(update.created_at))}
            </span>
          </div>
          <div className='flex flex-col items-start justify-start gap-2'>
            {update.output_measurables && (
              <p
                className='text-sm'
                title={update.output_measurables.description}
              >
                {update.output_measurables.output_id ? (
                  <Link
                    href={`/projects/${update.projects?.slug}/logframe#output-${update.output_measurables.output_id}`}
                  >
                    Output {update.output_measurables.code}
                  </Link>
                ) : (
                  <span>Output {update.output_measurables.code}</span>
                )}
              </p>
            )}
            {update.impact_indicators && (
              <p
                className='text-xs text-muted-foreground'
                title={update.impact_indicators.indicator_title}
              >
                Impact indicator {update.impact_indicators.indicator_code}
              </p>
            )}
          </div>
          <div className='flex flex-col gap-2'>
            <p className='text-sm'>{update.description}</p>
          </div>
          <div className='flex flex-col gap-2'>
            {update.impact_indicators && update.value && (
              <p className='text-sm text-muted-foreground'>
                {update.impact_indicators.indicator_unit}:{' '}
                {d3.format(',')(update.value)}
              </p>
            )}
            {update.type === 'Progress' && (
              <p className='text-sm text-muted-foreground'>Progress update</p>
            )}
            {update.link && (
              <Link
                href={update.link}
                target='_blank'
                className='text-sm text-sky-400 hover:underline'
              >
                View evidence
              </Link>
            )}
          </div>
        </div>
      ))}
      {updates.length === 0 && (
        <p className='pt-16 text-center text-sm text-muted-foreground'>
          No updates yet
        </p>
      )}
    </div>
  );
}
