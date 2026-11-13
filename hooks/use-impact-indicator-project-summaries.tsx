'use client';

import { isApprovedImpact } from '@/utils/update-review';
import * as d3 from 'd3';
import { useImpactIndicatorUpdates } from './use-impact-indicator-updates';

export const useImpactIndicatorProjectSummaries = (id: string) => {
  const { data, error, isLoading } = useImpactIndicatorUpdates(id);

  const projectSummaries = Array.from(
    d3.rollup(
      (data || []).filter(
        (update) => update.type === 'Progress' || isApprovedImpact(update),
      ),
      (v) => ({
        slug: v[0].projects?.slug,
        progressUpdatesCount: v.filter((d) => d.type === 'Progress').length,
        impactUpdatesCount: v.filter((d) => d.type === 'Impact').length,
        valueSum: d3.sum(v.filter(isApprovedImpact), (d) => d.value || 0),
        unit: v[0].impact_indicators?.indicator_unit,
      }),
      (d) => d.projects.name,
    ),
    ([name, values]) => ({
      name,
      ...values,
    }),
  ).sort((a, b) => (a.name || '').localeCompare(b.name || ''));

  return { projectSummaries, error, isLoading };
};
