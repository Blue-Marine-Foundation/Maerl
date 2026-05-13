'use server';

import { createClient } from '@/utils/supabase/server';
import { OVERVIEW_FETCH_CODES } from './pillar-config';

export type IndicatorRollup = {
  impact_indicator_id: number;
  indicator_code: string;
  indicator_title: string;
  indicator_unit: string;
  total_value: number;
  valid_updates: number;
};

export type PillarStoriesData = {
  projectCount: number;
  todayIso: string;
  /** Keyed by `indicator_code` */
  indicators: Record<string, IndicatorRollup>;
};

type ProjectRow = {
  id: number | null;
};

type IndicatorRow = {
  id: number;
  indicator_code: string;
  indicator_title: string;
  indicator_unit: string | null;
};

type UpdateRow = {
  value: number | null;
  impact_indicators: IndicatorRow | IndicatorRow[] | null;
};

function toIsoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function pickIndicator(
  ii: UpdateRow['impact_indicators'],
): IndicatorRow | null {
  if (!ii) return null;
  return Array.isArray(ii) ? (ii[0] ?? null) : ii;
}

export async function fetchPillarStoriesData(): Promise<PillarStoriesData> {
  const supabase = await createClient();
  const todayIso = toIsoDate(new Date());

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { projectCount: 0, todayIso, indicators: {} };
  }

  const { data: projectRows, error: projectError } = await supabase
    .from('projects')
    .select('id, user_projects!inner(user_id)')
    .eq('user_projects.user_id', user.id)
    .ilike('project_status', 'Active%');

  if (projectError) {
    throw new Error(`Failed to load active projects: ${projectError.message}`);
  }

  const projectIds = Array.from(
    new Set(
      ((projectRows ?? []) as ProjectRow[])
        .map((p) => p.id)
        .filter((id): id is number => id !== null),
    ),
  );

  if (projectIds.length === 0) {
    return { projectCount: 0, todayIso, indicators: {} };
  }

  const { data: updateRows, error: updateError } = await supabase
    .from('updates')
    .select(
      'value, impact_indicators!inner(id, indicator_code, indicator_title, indicator_unit)',
    )
    .eq('valid', true)
    .eq('duplicate', false)
    .eq('impact_indicators.ii_heirarchy', 'Indicator')
    .in('impact_indicators.indicator_code', [...OVERVIEW_FETCH_CODES])
    .in('project_id', projectIds);

  if (updateError) {
    throw new Error(`Failed to load overview indicators: ${updateError.message}`);
  }

  const byId = new Map<
    number,
    {
      impact_indicator_id: number;
      indicator_code: string;
      indicator_title: string;
      indicator_unit: string;
      total_value: number;
      valid_updates: number;
    }
  >();

  for (const row of (updateRows ?? []) as UpdateRow[]) {
    const ind = pickIndicator(row.impact_indicators);
    if (!ind) continue;
    const value = row.value ?? 0;
    const existing = byId.get(ind.id);
    if (existing) {
      existing.total_value += value;
      existing.valid_updates += 1;
    } else {
      byId.set(ind.id, {
        impact_indicator_id: ind.id,
        indicator_code: ind.indicator_code,
        indicator_title: ind.indicator_title,
        indicator_unit: ind.indicator_unit ?? '',
        total_value: value,
        valid_updates: 1,
      });
    }
  }

  const indicators: Record<string, IndicatorRollup> = {};
  for (const rollup of Array.from(byId.values())) {
    indicators[rollup.indicator_code] = rollup;
  }

  return {
    projectCount: projectIds.length,
    todayIso,
    indicators,
  };
}
