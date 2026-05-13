import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowRightIcon } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import Greeting from '@/components/overview/greeting';
import PillarStories from '@/components/overview/pillar-stories';
import RecentHighlights from '@/components/overview/recent-highlights';
import OperationalCounts from '@/components/overview/operational-counts';
import ForYouPanel from '@/components/overview/for-you-panel';
import CountryImpactMap from '@/components/overview/country-impact-map';

export default async function Index() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/sign-in');
  }

  return (
    <div className='max-w-app mx-auto flex w-full flex-col gap-8 py-6'>
      <Greeting />

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-12'>
        <div className='lg:col-span-5'>
          <ForYouPanel />
        </div>
        <section className='flex flex-col gap-3 lg:col-span-7'>
          <div className='flex items-baseline justify-between gap-3'>
            <div>
              <h2 className='text-lg font-semibold'>
                Where Blue works
              </h2>
              <p className='mt-1 text-sm text-muted-foreground'>
                Active projects by region and country. Hover for headline
                metrics, click for the project list.
              </p>
            </div>
            <Link
              href='/projects'
              className='flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground'
            >
              <span>Explore projects</span>
              <ArrowRightIcon className='h-4 w-4' />
            </Link>
          </div>
          <div className='min-h-[360px] w-full flex-1 overflow-hidden rounded-lg border'>
            <CountryImpactMap />
          </div>
        </section>
      </div>

      <section className='flex flex-col gap-4'>
        <div>
          <h2 className='text-lg font-semibold'>Impact by strategic pillar</h2>
          <p className='mt-1 text-sm text-muted-foreground'>
            Numbers come from approved indicator updates on projects you are
            assigned to (Active status only). Protection splits committed,
            proposed, and designated area in one bar; other rows deep-link to each
            indicator for detail.
          </p>
        </div>
        <PillarStories />
      </section>

      <RecentHighlights />

      <OperationalCounts />
    </div>
  );
}
