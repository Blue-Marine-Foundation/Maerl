'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ArrowRightIcon } from 'lucide-react';
import * as d3 from 'd3';
import { Skeleton } from '@/components/ui/skeleton';
import OverviewSectionHeader from './overview-section-header';
import {
  fetchNeedsAttentionCounts,
  type NeedsAttentionCounts,
} from './needs-attention-server-actions';

type Row = {
  key: string;
  label: string;
  description: string;
  href: string;
  getValue: (c: NeedsAttentionCounts) => number;
};

const ROWS: readonly Row[] = [
  {
    key: 'pending-review',
    label: 'Updates pending review',
    description: 'Valid updates not yet admin-reviewed',
    href: '/updates',
    getValue: (c) => c.updatesPendingReview,
  },
  {
    key: 'unverified',
    label: 'Updates unverified',
    description: 'Valid updates not yet verified',
    href: '/updates',
    getValue: (c) => c.updatesUnverified,
  },
  {
    key: 'stale-projects',
    label: 'Stale active projects',
    description: 'Active projects with no update in 180+ days',
    href: '/projects',
    getValue: (c) => c.staleActiveProjects,
  },
];

function AttentionCard({
  row,
  value,
  isLoading,
}: Readonly<{
  row: Row;
  value: number | null;
  isLoading: boolean;
}>) {
  return (
    <Link
      href={row.href}
      className='group flex items-center justify-between gap-4 rounded-xl border border-border/80 bg-card p-5 shadow-sm transition-colors hover:border-border'
    >
      <div className='flex min-w-0 flex-col gap-0.5'>
        <span className='text-sm font-semibold'>{row.label}</span>
        <span className='text-xs text-muted-foreground'>{row.description}</span>
      </div>
      <div className='flex shrink-0 items-center gap-2 whitespace-nowrap'>
        {isLoading || value === null ? (
          <Skeleton className='h-7 w-12' />
        ) : (
          <span className='text-xl font-bold tabular-nums'>
            {d3.format(',')(value)}
          </span>
        )}
        <ArrowRightIcon className='h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5' />
      </div>
    </Link>
  );
}

export default function NeedsAttention() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['overview-needs-attention'],
    queryFn: fetchNeedsAttentionCounts,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <section className='flex flex-col gap-4'>
      <OverviewSectionHeader
        title='Needs your attention'
        subtitle='Admin-only signals that the data needs work.'
      />

      {error ? (
        <p className='text-sm text-muted-foreground'>
          Failed to load: {(error as Error).message}
        </p>
      ) : (
        <div className='flex flex-col gap-4'>
          {ROWS.map((row) => (
            <AttentionCard
              key={row.key}
              row={row}
              isLoading={isLoading}
              value={data ? row.getValue(data) : null}
            />
          ))}
        </div>
      )}
    </section>
  );
}
