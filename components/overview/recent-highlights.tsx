import Link from 'next/link';
import { ArrowRightIcon } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import type { Update } from '@/utils/types';
import HighlightCard from './highlight-card';

const TARGET_COUNT = 3;
const MIN_DESCRIPTION_LENGTH = 80;

const SELECT_FIELDS =
  '*, projects(name, slug, project_type), impact_indicators(indicator_code, indicator_unit, indicator_title)';

// Two-pass query: a strict heuristic that prioritises admin-reviewed,
// linked-evidence updates, then a relaxed fallback that drops the
// `admin_reviewed` filter to fill any remaining slots. This keeps quality
// high once the review backlog is processed but ensures the page never
// renders fewer than 3 highlight cards while the backlog exists.
async function fetchHighlightCandidates() {
  const supabase = await createClient();

  const { data: strict, error: strictError } = await supabase
    .from('updates')
    .select(SELECT_FIELDS)
    .eq('valid', true)
    .eq('duplicate', false)
    .eq('admin_reviewed', true)
    .not('link', 'is', null)
    .not('value', 'is', null)
    .not('description', 'is', null)
    .order('date', { ascending: false, nullsFirst: false })
    .limit(TARGET_COUNT * 2);

  if (strictError) {
    return { updates: [] as Update[], error: strictError };
  }

  const filteredStrict = (strict ?? []).filter(
    (u) => (u.description?.length ?? 0) >= MIN_DESCRIPTION_LENGTH,
  );

  if (filteredStrict.length >= TARGET_COUNT) {
    return {
      updates: filteredStrict.slice(0, TARGET_COUNT) as Update[],
      error: null,
    };
  }

  const seen = new Set(filteredStrict.map((u) => u.id));
  const need = TARGET_COUNT - filteredStrict.length;

  const { data: relaxed, error: relaxedError } = await supabase
    .from('updates')
    .select(SELECT_FIELDS)
    .eq('valid', true)
    .eq('duplicate', false)
    .not('link', 'is', null)
    .not('value', 'is', null)
    .not('description', 'is', null)
    .order('date', { ascending: false, nullsFirst: false })
    .limit(need * 4);

  if (relaxedError) {
    return { updates: filteredStrict as Update[], error: relaxedError };
  }

  const filteredRelaxed = (relaxed ?? []).filter(
    (u) =>
      !seen.has(u.id) &&
      (u.description?.length ?? 0) >= MIN_DESCRIPTION_LENGTH,
  );

  return {
    updates: [
      ...filteredStrict,
      ...filteredRelaxed.slice(0, need),
    ] as Update[],
    error: null,
  };
}

export default async function RecentHighlights() {
  const { updates, error } = await fetchHighlightCandidates();

  return (
    <section className='flex flex-col gap-4'>
      <div>
        <h2 className='text-lg font-semibold'>Recent highlights</h2>
        <p className='mt-1 text-sm text-muted-foreground'>
          The latest evidenced wins from across the portfolio.
        </p>
      </div>

      {error && (
        <p className='text-sm text-muted-foreground'>
          Failed to load highlights: {error.message}
        </p>
      )}

      {!error && updates.length === 0 && (
        <p className='text-sm text-muted-foreground'>
          No highlights to feature yet.
        </p>
      )}

      {!error && updates.length > 0 && (
        <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
          {updates.map((update) => (
            <HighlightCard key={update.id} update={update} />
          ))}
        </div>
      )}

      <Link
        href='/updates'
        className='flex items-center justify-end gap-2 text-sm text-muted-foreground hover:text-foreground'
      >
        <span>View all updates</span>
        <ArrowRightIcon className='h-4 w-4' />
      </Link>
    </section>
  );
}
