'use client';

import { useUrlDates } from './use-url-dates';
import { fetchProjectImpactUpdates } from '@/api/fetch-project-impact-updates';
import { useQuery } from '@tanstack/react-query';

export const useProjectImpacts = (projectSlug: string) => {
  const dateRange = useUrlDates();

  const {
    data: projectImpactUpdates = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      'project-impact-updates',
      dateRange.from,
      dateRange.to,
      projectSlug,
    ],
    queryFn: () =>
      fetchProjectImpactUpdates(
        { from: dateRange.from, to: dateRange.to },
        projectSlug,
      ),
  });

  const impactIndicatorSummaries = projectImpactUpdates
    .reduce(
      (
        acc: {
          impactIndicatorId: number;
          impactIndicatorCode: string;
          impactIndicatorTitle: string;
          impactIndicatorUnit: string;
          count: number;
          value: number;
        }[],
        update,
      ) => {
        const impactIndicatorId = update.impact_indicators.id;
        const impactIndicatorCode = update.impact_indicators.indicator_code;
        const impactIndicatorTitle = update.impact_indicators.indicator_title;
        const impactIndicatorUnit = update.impact_indicators.indicator_unit;
        const value = update.value ?? 0;
        const existing = acc.find(
          (item) => item.impactIndicatorId === impactIndicatorId,
        );
        if (existing) {
          existing.count += 1;
          existing.value += value;
        } else {
          if (impactIndicatorId) {
            acc.push({
              impactIndicatorId,
              impactIndicatorCode,
              impactIndicatorTitle,
              impactIndicatorUnit,
              count: 1,
              value,
            });
          }
        }
        return acc;
      },
      [],
    )
    .sort((a, b) => a.impactIndicatorId - b.impactIndicatorId);

  return {
    impactIndicatorSummaries,
    isLoading,
    error,
  };
};
