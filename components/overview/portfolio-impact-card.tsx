import Link from 'next/link';
import * as d3 from 'd3';
import { ArrowUpRightIcon } from 'lucide-react';
import type { Update } from '@/utils/types';

function formatUnitLabel(
  unit: string | null | undefined,
  code: string | null | undefined,
): string {
  const map: Record<string, string> = {
    '5.2.1': 'beneficiaries',
    '5.2.2': 'beneficiaries',
    '5.3.1': 'stakeholders',
    '5.3.3': 'people',
    '5.6.1': 'people',
    '2.2.4': 'specimens',
  };
  if (code && map[code]) return map[code];

  if (!unit) return '';
  const lower = unit.toLowerCase();
  if (lower.includes('stakeholder')) return 'stakeholders';
  if (lower.includes('beneficiar')) return 'beneficiaries';
  if (lower.includes('people') || lower.includes('person')) return 'people';
  if (lower.includes('specimen')) return 'specimens';
  if (lower.includes('km')) return 'km²';
  return lower;
}

export default function PortfolioImpactCard({
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

  const unitLabel = formatUnitLabel(
    indicator?.indicator_unit,
    indicator?.indicator_code,
  );

  return (
    <article className='flex h-full flex-col gap-4 rounded-xl border border-border/80 bg-card p-6 shadow-sm'>
      <header className='flex items-start justify-between gap-3'>
        <div className='min-w-0 text-sm'>
          {project && projectHref ? (
            <Link href={projectHref} className='hover:underline'>
              <span className='font-semibold text-foreground'>
                {project.name}
              </span>
              {dateLabel ? (
                <span className='text-muted-foreground'> · {dateLabel}</span>
              ) : null}
            </Link>
          ) : (
            <span className='font-semibold text-muted-foreground'>
              Unknown project
              {dateLabel ? (
                <span className='font-normal text-muted-foreground'>
                  {' '}
                  · {dateLabel}
                </span>
              ) : null}
            </span>
          )}
        </div>
        {indicator?.indicator_code ? (
          <span className='shrink-0 text-xs text-muted-foreground'>
            Indicator {indicator.indicator_code}
          </span>
        ) : null}
      </header>

      {formattedValue !== null && (
        <div className='flex flex-col gap-0.5'>
          <p className='text-4xl font-bold tabular-nums tracking-tight text-foreground'>
            {formattedValue}
          </p>
          {unitLabel ? (
            <p className='text-sm text-muted-foreground'>{unitLabel}</p>
          ) : null}
        </div>
      )}

      {update.description ? (
        <p className='flex-1 whitespace-pre-line text-sm leading-relaxed text-foreground'>
          {update.description}
        </p>
      ) : null}

      {update.link ? (
        <footer className='pt-1'>
          <Link
            href={update.link}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:underline'
          >
            View evidence
            <ArrowUpRightIcon className='h-3.5 w-3.5' aria-hidden />
          </Link>
        </footer>
      ) : null}
    </article>
  );
}
