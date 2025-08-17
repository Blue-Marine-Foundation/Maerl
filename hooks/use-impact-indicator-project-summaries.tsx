'use client';

import * as d3 from 'd3';
import { useImpactIndicatorUpdates } from './use-impact-indicator-updates';

export const useImpactIndicatorProjectSummaries = (id: string) => {
  const { data, error, isLoading } = useImpactIndicatorUpdates(id);

  const projectSummaries = Array.from(
    d3.rollup(
      data || [],
      (v) => ({
        slug: v[0].projects?.slug,
        progressUpdatesCount: v.filter((d) => d.type === 'Progress').length,
        impactUpdatesCount: v.filter((d) => d.type === 'Impact').length,
        valueSum: d3.sum(v, (d) => d.value || 0),
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
