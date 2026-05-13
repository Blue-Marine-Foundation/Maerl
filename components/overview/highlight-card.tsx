import Link from 'next/link';
import * as d3 from 'd3';
import { ArrowUpRightIcon, ExternalLinkIcon } from 'lucide-react';
import type { Update } from '@/utils/types';

export default function HighlightCard({
  update,
}: Readonly<{ update: Update }>) {
  const project = update.projects;
  const indicator = update.impact_indicators;

  const projectBase = project?.project_type === 'Unit' ? 'units' : 'projects';
  const projectHref = project ? `/${projectBase}/${project.slug}` : null;

  const dateLabel = update.date
    ? d3.timeFormat('%d %b %Y')(new Date(update.date))
    : null;

  const formattedValue =
    update.value === null || update.value === undefined
      ? null
      : d3.format(',')(update.value);

  return (
    <article className='flex flex-col gap-4 rounded-lg border bg-card p-5'>
      <header className='flex flex-wrap items-baseline justify-between gap-3'>
        <div className='flex flex-wrap items-baseline gap-3'>
          {project && projectHref ? (
            <Link
              href={projectHref}
              className='text-sm font-semibold hover:underline'
            >
              {project.name}
            </Link>
          ) : (
            <span className='text-sm font-semibold text-muted-foreground'>
              Unknown project
            </span>
          )}
          {dateLabel && (
            <span className='font-mono text-xs text-muted-foreground'>
              {dateLabel}
            </span>
          )}
        </div>
        {indicator && (
          <span className='inline-flex items-center rounded-full border border-foreground/20 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground'>
            Indicator {indicator.indicator_code}
          </span>
        )}
      </header>

      <p className='whitespace-pre-line text-sm leading-relaxed'>
        {update.description}
      </p>

      <footer className='flex flex-wrap items-center justify-between gap-3 pt-1'>
        <div className='flex items-baseline gap-2'>
          {formattedValue !== null && (
            <>
              <span className='text-2xl font-bold tabular-nums'>
                {formattedValue}
              </span>
              {indicator?.indicator_unit && (
                <span className='text-xs text-muted-foreground'>
                  {indicator.indicator_unit}
                </span>
              )}
            </>
          )}
        </div>
        <div className='flex items-center gap-2'>
          {update.link && (
            <Link
              href={update.link}
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground'
            >
              <ExternalLinkIcon className='h-3 w-3' />
              View linked evidence
            </Link>
          )}
          {projectHref && (
            <Link
              href={projectHref}
              className='inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground'
            >
              Visit project
              <ArrowUpRightIcon className='h-3 w-3' />
            </Link>
          )}
        </div>
      </footer>
    </article>
  );
}
