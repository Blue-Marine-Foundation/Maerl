'use client';

import ProjectsDataTableWrapper from '@/components/projects-data-table/data-table-wrapper';
import CountryImpactMap from '@/components/overview/country-impact-map';

export default function ProjectsDirectory() {
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
