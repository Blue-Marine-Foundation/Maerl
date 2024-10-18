import { supabase } from '@/utils/supabase/service-role';
import { createClient } from '@/utils/supabase/server';
import PageHeading from '@/components/ui/page-heading';
import { PlusCircleIcon } from 'lucide-react';

export async function generateStaticParams() {
  const { data: projects, error } = await supabase.from('projects').select('*');

  if (error) {
    throw new Error(`Failed to fetch projects: ${error.message}`);
  }

  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: {
    slug: string;
  };
}) {
  return {
    title: `${params.slug.slice(0, 3).toUpperCase()} | Maerl`,
  };
}

export default async function Project({
  params,
}: {
  params: {
    slug: string;
  };
}) {
  const supabaseClient = createClient();
  const { data: project, error: projectError } = await supabaseClient
    .from('projects')
    .select('*, users (*)')
    .eq('slug', params.slug)
    .single();

  if (projectError) {
    console.log(`Failed to fetch projects: ${projectError.message}`);

    return (
      <div className='animate-in'>
        <div className='mb-8'>
          <PageHeading>Error loading project</PageHeading>
        </div>

        <div className='flex flex-col items-center gap-4 rounded-lg bg-card p-20'>
          <h2 className='font-semibold'>
            Error loading project:{' '}
            <span className='font-mono text-muted-foreground'>
              {params.slug}
            </span>
          </h2>
          <p>
            Please screenshot this whole page (including the address bar) and
            forward it to the SII team:
          </p>
          <p className='rounded-md bg-slate-600 px-2 py-1 text-xs'>
            <code>{projectError.message}</code>
          </p>
        </div>
      </div>
    );
  }

  const pm = `${project.users.first_name} ${project.users.last_name}` || '';

  const flatProject = { ...project, pm };

  const projectMetadataKeys = [
    {
      label: 'Project Manager',
      key: 'pm',
    },
    {
      label: 'Support',
      key: 'support',
    },
    {
      label: 'Start Date',
      key: 'start_date',
    },
    {
      label: 'Regional Strategy',
      key: 'regional_strategy',
    },
    {
      label: 'Units',
      key: 'unit_requirements',
    },
    {
      label: 'Pillars',
      key: 'pillars',
    },
    {
      label: 'Local Contacts',
      key: 'local_contacts',
    },
    {
      label: 'Highlights',
      key: 'highlights',
    },
    {
      label: 'Current Issues',
      key: 'current_issues',
    },
    {
      label: 'Proposed Solutions',
      key: 'proposed_solutions',
    },
    {
      label: 'Board Intervention Required',
      key: 'board_intervention_required',
    },
  ];

  return (
    <div className='flex flex-col gap-8 animate-in'>
      <PageHeading>{project.name}</PageHeading>

      <div className='grid grid-cols-3 items-start gap-4'>
        <div className='flex min-h-64 flex-col gap-6 rounded-md bg-card p-4'>
          <div className='flex items-center justify-between gap-4'>
            <h3 className='text-sm font-semibold text-muted-foreground'>
              Project Metadata
            </h3>
            <button
              role='button'
              className='flex items-center gap-2 rounded-md border border-dashed px-2 py-1 text-sm text-foreground/80 transition-all hover:border-solid hover:border-foreground/50 hover:text-foreground'
            >
              Edit
            </button>
          </div>

          <div className='flex flex-grow flex-col gap-4'>
            <div className='grid grid-cols-[170px_auto] gap-4 text-sm'>
              <p className='mb-1 text-sm text-foreground/80'>Project Status</p>
              <p>
                <span
                  className={`rounded-md px-3 py-1 text-sm font-light tracking-wide ${
                    flatProject.project_status === 'Active' &&
                    'bg-green-500/15 text-green-500'
                  } ${
                    flatProject.project_status === 'Pipeline' &&
                    'bg-yellow-500/15 text-yellow-400'
                  } ${
                    flatProject.project_status === 'Complete' &&
                    'bg-blue-500/15 text-blue-400'
                  } }`}
                >
                  {flatProject.project_status}
                </span>
              </p>
            </div>
            {projectMetadataKeys.map((key) => (
              <div
                className='grid grid-cols-[170px_auto] gap-4 text-sm'
                key={key.key}
              >
                <p className='mb-1 text-sm text-foreground/80'>{key.label}</p>
                <p className='text-foreground'>{flatProject[key.key]}</p>
              </div>
            ))}
          </div>
        </div>
        <div className='flex min-h-64 flex-col rounded-md bg-card p-4'>
          <h3 className='mb-auto text-sm font-semibold text-muted-foreground'>
            Logframe
          </h3>
          <div className='flex flex-grow flex-col items-center justify-center gap-2'>
            <p className='text-foreground/80'>
              This project has no logframe yet
            </p>
            <button className='mt-2 flex items-center gap-2 rounded-md border border-dashed px-3 py-1.5 text-sm text-foreground/80 transition-all hover:border-solid hover:border-foreground/50 hover:text-foreground'>
              <PlusCircleIcon className='h-4 w-4' /> Create logframe
            </button>
          </div>
        </div>
        <div className='flex min-h-64 flex-col rounded-md bg-card p-4'>
          <h3 className='mb-auto text-sm font-semibold text-muted-foreground'>
            Funding requests
          </h3>
          <div className='flex flex-grow flex-col items-center justify-center gap-2'>
            <p className='text-foreground/80'>
              This project has no funding requests yet
            </p>
            <button className='mt-2 flex items-center gap-2 rounded-md border border-dashed px-3 py-1.5 text-sm text-foreground/80 transition-all hover:border-solid hover:border-foreground/50 hover:text-foreground'>
              <PlusCircleIcon className='h-4 w-4' /> Create funding request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
