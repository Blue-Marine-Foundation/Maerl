'use client';

import Link from 'next/link';
import ProjectsDataTableWrapper from '@/components/projects-data-table/data-table-wrapper';
import CountryImpactMap from '@/components/overview/country-impact-map';
import { STALE_THRESHOLD_DAYS } from '@/utils/stale-projects';

export default function ProjectsDirectory({
  staleOnly = false,
}: Readonly<{ staleOnly?: boolean }>) {
  if (staleOnly) {
    return (
      <section className='flex flex-col gap-3'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-lg font-semibold'>Stale active projects</h2>
            <p className='mt-1 text-sm text-muted-foreground'>
              Active projects with no update in {STALE_THRESHOLD_DAYS}+ days,
              oldest first. Use the PM column to see who to follow up with.
            </p>
          </div>
          <Link
            href='/projects'
            className='text-sm font-medium text-brand-twilight underline-offset-4 hover:underline'
          >
            Show all projects
          </Link>
        </div>
        <ProjectsDataTableWrapper staleOnly />
      </section>
    );
  }

  return (
    <div className='flex flex-col gap-8'>
      <section className='flex flex-col gap-3'>
        <p className='text-sm text-muted-foreground'>
          Active projects by region and country. Hover a territory for headline
          metrics; click for projects in that geography. Global programmes and
          projects without a map label are listed in the map footnotes.
        </p>
        <div className='h-[min(520px,70vh)] min-h-[320px] w-full overflow-hidden rounded-lg border'>
          <CountryImpactMap />
        </div>
      </section>

      <section className='flex flex-col gap-3'>
        <div>
          <h2 className='text-lg font-semibold'>Project list</h2>
          <p className='mt-1 text-sm text-muted-foreground'>
            Full project and unit directory with filters, column controls, and
            export.
          </p>
        </div>
        <ProjectsDataTableWrapper />
      </section>
    </div>
  );
}
