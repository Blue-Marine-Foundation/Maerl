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

  const [activeProjectsRes, updatesRes] = await Promise.all([
    supabase
      .from('projects')
      .select('id', { count: 'exact', head: true })
      .ilike('project_status', 'Active%'),
    supabase
      .from('updates')
      .select(
        'value, impact_indicators!inner(id, indicator_code, indicator_title, indicator_unit), projects!inner(id)',
      )
      .eq('valid', true)
      .eq('duplicate', false)
      .eq('impact_indicators.ii_heirarchy', 'Indicator')
      .in('impact_indicators.indicator_code', [...OVERVIEW_FETCH_CODES])
      .ilike('projects.project_status', 'Active%'),
  ]);

  if (activeProjectsRes.error) {
    throw new Error(
      `Failed to load active projects: ${activeProjectsRes.error.message}`,
    );
  }
  if (updatesRes.error) {
    throw new Error(
      `Failed to load overview indicators: ${updatesRes.error.message}`,
    );
  }

  const updateRows = updatesRes.data;

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
    projectCount: activeProjectsRes.count ?? 0,
    todayIso,
    indicators,
  };
}
