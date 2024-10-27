import FeatureCard from '../ui/feature-card';
import Link from 'next/link';
import { PlusCircleIcon } from 'lucide-react';
import { fetchLogframe } from './server-action';
import { Badge } from '../ui/badge';

export default async function LogframeCard({
  projectId,
  slug,
}: {
  projectId: number;
  slug: string;
}) {
  const { data, error } = await fetchLogframe(projectId);

  if (error) {
    return (
      <FeatureCard title='Logframe'>
        <p>Error loading impact and outcomes: {error.message}</p>
      </FeatureCard>
    );
  }

  const impact = data?.impacts[0];
  const outcomes = data?.outcomes;

  const cardLinks = [
    {
      label: 'View theory of change',
      href: `/projects/${slug}/theory-of-change`,
    },
    {
      label: 'View logframe',
      href: `/projects/${slug}/logframe`,
    },
  ];

  return (
    <FeatureCard title='Logframe'>
      {impact && (
        <div className='flex flex-col gap-2'>
          <p className='text-sm text-muted-foreground'>Impact</p>
          <p>{impact.title}</p>
        </div>
      )}

      {outcomes &&
        outcomes.length > 0 &&
        outcomes.map((outcome) => (
          <div key={outcome.id} className='flex flex-col gap-2'>
            <p className='text-sm text-muted-foreground'>Outcomes</p>
            <p className='text-sm'>
              <Badge className='mr-2'>{outcome.code}</Badge>
              {outcome.description}
            </p>
          </div>
        ))}

      {!impact && (!outcomes || outcomes.length === 0) && (
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

      {(impact || (outcomes && outcomes.length > 0)) && (
        <div className='mt-2 flex items-center justify-end gap-4 text-sm'>
          {cardLinks.map((link) => (
            <Link
              key={link.href}
              className='rounded border bg-white/10 px-2 py-1 transition-all hover:border-muted-foreground'
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </FeatureCard>
  );
}
