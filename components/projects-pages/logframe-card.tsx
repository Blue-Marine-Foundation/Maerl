import { createClient } from '@/utils/supabase/server';
import FeatureCard from '../ui/feature-card';
import Link from 'next/link';
import { PlusCircleIcon } from 'lucide-react';

export default async function LogframeCard({
  projectId,
  slug,
}: {
  projectId: number;
  slug: string;
}) {
  const supabase = await createClient();
  const { data: impact, error: impactError } = await supabase
    .from('impacts')
    .select('*')
    .eq('project_id', projectId)
    .single();

  const { data: outcomes, error: outcomesError } = await supabase
    .from('outcomes')
    .select('*')
    .eq('project_id', projectId)
    .single();

  if (impactError && outcomesError) {
    return (
      <FeatureCard title='Logframe'>
        <p>
          Error loading impact and outcomes: {impactError.message};{' '}
          {outcomesError.message}
        </p>
      </FeatureCard>
    );
  }

  const cardLinks = [
    {
      label: 'View theory of change',
      href: `/projects/${slug}/logframe`,
    },
    {
      label: 'View outputs',
      href: `/projects/${slug}/outputs`,
    },
  ];

  return (
    <FeatureCard title='Logframe'>
      {impact ? (
        <>
          <div className='flex flex-col gap-2'>
            <p className='text-sm text-muted-foreground'>Impact</p>
            <p>{impact.title}</p>
          </div>
          <div className='flex items-center justify-end gap-4 text-sm'>
            {cardLinks.map((link) => (
              <Link
                key={link.href}
                className='rounded border px-2 py-1'
                href={link.href}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </>
      ) : (
        <div className='flex flex-grow flex-col items-center justify-center gap-2'>
          <p className='text-foreground/80'>This project has no logframe yet</p>
          <Link
            href={`/projects/${slug}/logframe`}
            className='mt-2 flex items-center gap-2 rounded-md border border-dashed px-3 py-1.5 text-sm text-foreground/80 transition-all hover:border-solid hover:border-foreground/50 hover:text-foreground'
          >
            <PlusCircleIcon className='h-4 w-4' /> Create logframe
          </Link>
        </div>
      )}
    </FeatureCard>
  );
}
