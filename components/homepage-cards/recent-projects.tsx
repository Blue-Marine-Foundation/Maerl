import Link from 'next/link';
import FeatureCard from '../ui/feature-card';
import { ArrowRightIcon } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import ProjectStatusBadge from '../ui/project-status-badge';
import * as d3 from 'd3';

export default async function RecentProjects() {
  const supabase = await createClient();

  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .not('last_updated', 'is', null)
    .order('last_updated', { ascending: false })
    .limit(5);

  if (error) {
    return (
      <FeatureCard title='Recent Updates'>
        <p>Error fetching projects from database: {error.message}</p>
      </FeatureCard>
    );
  }

  return (
    <FeatureCard title='Recently updated projects'>
      <div className='flex flex-col gap-2'>
        {projects?.map((project) => (
          <Link
            className='flex items-center justify-between gap-2'
            href={`/${project.project_type === 'Unit' ? 'units' : 'projects'}/${project.slug}`}
            key={project.id}
          >
            <span className='max-w-48 truncate'>{project.name}</span>
            <hr className='grow' />
            <ProjectStatusBadge status={project.project_status} size='xs' />
            <span className='font-mono text-xs text-muted-foreground'>
              {d3.timeFormat('%d %b %Y')(new Date(project.last_updated))}
            </span>
          </Link>
        ))}
      </div>
      <div className='flex justify-end'>
        <Link
          className='flex items-center justify-end gap-2 rounded-md py-1 text-sm hover:bg-white/10'
          href='/projects'
        >
          <span>View all projects</span>
          <ArrowRightIcon className='h-4 w-4' />
        </Link>
      </div>
    </FeatureCard>
  );
}
