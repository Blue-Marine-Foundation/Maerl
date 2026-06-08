'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRightIcon } from 'lucide-react';
import { cn } from '@/utils/cn';
import ProjectsDataTableWrapper from '@/components/projects-data-table/data-table-wrapper';
import CountryImpactMap from '@/components/overview/country-impact-map';

type View = 'table' | 'map';

export default function ProjectsDirectory() {
  const [view, setView] = useState<View>('map');

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div
          className='inline-flex rounded-lg border border-border/80 bg-muted/30 p-0.5'
          role='tablist'
          aria-label='Projects view'
        >
          <button
            type='button'
            role='tab'
            aria-selected={view === 'map'}
            className={cn(
              'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              view === 'map'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
            onClick={() => setView('map')}
          >
            Map
          </button>
          <button
            type='button'
            role='tab'
            aria-selected={view === 'table'}
            className={cn(
              'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              view === 'table'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
            onClick={() => setView('table')}
          >
            Table
          </button>
        </div>
        {view === 'map' && (
          <Link
            href='/impactindicators'
            className='flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground'
          >
            <span>Pillar totals on Impact</span>
            <ArrowRightIcon className='h-4 w-4' />
          </Link>
        )}
      </div>

      {view === 'table' ? (
        <ProjectsDataTableWrapper />
      ) : (
        <section className='flex flex-col gap-3'>
          <p className='text-sm text-muted-foreground'>
            Active projects by region and country. Hover a territory for
            headline metrics; click for projects in that geography. Global
            programmes and projects without a map label are listed in the map
            footnotes — use the table view for the full directory.
          </p>
          <div className='h-[min(520px,70vh)] min-h-[320px] w-full overflow-hidden rounded-lg border'>
            <CountryImpactMap />
          </div>
        </section>
      )}
    </div>
  );
}
