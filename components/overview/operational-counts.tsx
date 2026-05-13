'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import * as d3 from 'd3';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/utils/cn';
import {
  fetchOperationalCounts,
  type OperationalCounts,
} from './operational-counts-server-actions';

type CardSpec = {
  key: string;
  label: string;
  description: string;
  getValue: (s: OperationalCounts) => number;
  getHref: (s: OperationalCounts) => string | null;
};

const CARDS: readonly CardSpec[] = [
  {
    key: 'active-projects',
    label: 'Active projects',
    description: 'Currently active across the portfolio',
    getValue: (s) => s.activeProjects,
    getHref: () => '/projects',
  },
  {
    key: 'updates-this-month',
    label: 'Updates this month',
    description: 'New evidence captured this month',
    getValue: (s) => s.updatesThisMonth,
    getHref: (s) => `/updates?from=${s.monthStartIso}&to=${s.todayIso}`,
  },
  {
    key: 'indicators-this-year',
    label: 'Indicators with new data',
    description: `Indicators receiving new data in ${new Date().getFullYear()}`,
    getValue: (s) => s.indicatorsWithDataThisYear,
    getHref: (s) => `/impactindicators?from=${s.yearStartIso}&to=${s.todayIso}`,
  },
];

function OperationalCard({
  label,
  description,
  value,
  href,
  isLoading,
}: Readonly<{
  label: string;
  description: string;
  value: number | null;
  href: string | null;
  isLoading: boolean;
}>) {
  const baseClass =
    'flex flex-1 items-center justify-between gap-4 rounded-md border bg-card/60 px-4 py-3';
  const interactiveClass =
    'transition-colors hover:border-foreground/30 hover:bg-card/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40';

  const content = (
    <>
      <div className='flex flex-col gap-0.5'>
        <p className='text-xs font-medium text-muted-foreground'>{label}</p>
        <p className='text-[11px] text-muted-foreground/70'>{description}</p>
      </div>
      {isLoading ? (
        <Skeleton className='h-6 w-12' />
      ) : (
        <p className='text-xl font-semibold tabular-nums'>
          {value === null ? '—' : d3.format(',.0f')(value)}
        </p>
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cn(baseClass, interactiveClass)}>
        {content}
      </Link>
    );
  }
  return <div className={baseClass}>{content}</div>;
}

export default function OperationalCounts() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['overview-operational-counts'],
    queryFn: fetchOperationalCounts,
    staleTime: 5 * 60 * 1000,
  });

  if (error) {
    return (
      <p className='text-sm text-muted-foreground'>
        Failed to load operational counts: {(error as Error).message}
      </p>
    );
  }

  return (
    <div className='flex flex-col gap-3'>
      <div>
        <h2 className='text-sm font-semibold text-muted-foreground'>
          Operational signals
        </h2>
      </div>
      <div className='grid grid-cols-1 gap-2 sm:grid-cols-3'>
        {CARDS.map((card) => {
          const value = data ? card.getValue(data) : null;
          const href = data ? card.getHref(data) : null;
          return (
            <OperationalCard
              key={card.key}
              label={card.label}
              description={card.description}
              value={value}
              href={href}
              isLoading={isLoading}
            />
          );
        })}
      </div>
    </div>
  );
}
