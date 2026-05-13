'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ArrowRightIcon } from 'lucide-react';
import * as d3 from 'd3';
import { Skeleton } from '@/components/ui/skeleton';
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

// `/updates` and `/projects` don't currently accept URL filters that match
// these signals, so each card links to the parent list view and the count
// itself is the actionable bit.
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

export default function NeedsAttention() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['overview-needs-attention'],
    queryFn: fetchNeedsAttentionCounts,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className='flex h-full flex-col gap-4 rounded-lg border bg-card p-5'>
      <div>
        <h2 className='text-base font-semibold'>Needs your attention</h2>
        <p className='mt-1 text-xs text-muted-foreground'>
          Admin-only signals that the data needs work.
        </p>
      </div>

      {error ? (
        <p className='text-sm text-muted-foreground'>
          Failed to load: {(error as Error).message}
        </p>
      ) : (
        <div className='flex flex-col divide-y'>
          {ROWS.map((row) => {
            const value = data ? row.getValue(data) : null;
            return (
              <Link
                key={row.key}
                href={row.href}
                className='group flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0 hover:text-foreground'
              >
                <div className='flex flex-col gap-0.5'>
                  <span className='text-sm font-medium'>{row.label}</span>
                  <span className='text-xs text-muted-foreground'>
                    {row.description}
                  </span>
                </div>
                <div className='flex items-center gap-2 whitespace-nowrap'>
                  {isLoading || value === null ? (
                    <Skeleton className='h-6 w-12' />
                  ) : (
                    <span className='text-xl font-bold tabular-nums'>
                      {d3.format(',')(value)}
                    </span>
                  )}
                  <ArrowRightIcon className='h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5' />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
