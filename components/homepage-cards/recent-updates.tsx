import { createClient } from '@/utils/supabase/server';
import FeatureCard from '../ui/feature-card';
import * as d3 from 'd3';
import Link from 'next/link';

export default async function RecentUpdates() {
  const supabase = await createClient();

  const { data: updates, error } = await supabase
    .from('updates')
    .select('*, projects(name, slug)')
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    return (
      <FeatureCard title='Recent Updates'>
        <p>Error fetching updates from database: {error.message}</p>
      </FeatureCard>
    );
  }

  return (
    <FeatureCard title='Recent Updates'>
      <div className='flex flex-col gap-5'>
        {updates?.map((update) => (
          <div
            className='grid grid-cols-1 gap-4 border-t pt-5 first:border-t-0 first:pt-0 md:grid-cols-[1fr_3fr]'
            key={update.id}
          >
            <div className='flex flex-col gap-2'>
              <Link
                className='max-w-48 truncate text-sm font-medium hover:underline'
                href={`/projects/${update.projects.slug}`}
              >
                {update.projects.name}
              </Link>
              <span className='text-xs text-muted-foreground'>
                {d3.timeFormat('%d %b %Y')(new Date(update.created_at))}
              </span>
            </div>
            <p className='text-sm'>{update.description}</p>
          </div>
        ))}
      </div>
    </FeatureCard>
  );
}
