'use server';

import { createClient } from '@/utils/supabase/server';

export type NeedsAttentionCounts = {
  updatesPendingReview: number;
  updatesUnverified: number;
  staleActiveProjects: number;
  staleThresholdIso: string;
};

const STALE_THRESHOLD_DAYS = 180;

export async function fetchNeedsAttentionCounts(): Promise<NeedsAttentionCounts> {
  const supabase = await createClient();

  const staleThreshold = new Date();
  staleThreshold.setDate(staleThreshold.getDate() - STALE_THRESHOLD_DAYS);
  const staleThresholdIso = staleThreshold.toISOString();

  const [pendingReviewRes, unverifiedRes, staleProjectsRes] = await Promise.all([
    supabase
      .from('updates')
      .select('id', { count: 'exact', head: true })
      .eq('valid', true)
      .eq('duplicate', false)
      .not('admin_reviewed', 'is', true),
    supabase
      .from('updates')
      .select('id', { count: 'exact', head: true })
      .eq('valid', true)
      .eq('duplicate', false)
      .not('verified', 'is', true),
    supabase
      .from('projects')
      .select('id', { count: 'exact', head: true })
      .ilike('project_status', 'Active%')
      .or(`last_updated.is.null,last_updated.lt.${staleThresholdIso}`),
  ]);

  if (pendingReviewRes.error) {
    throw new Error(
      `Failed to load pending-review count: ${pendingReviewRes.error.message}`,
    );
  }
  if (unverifiedRes.error) {
    throw new Error(
      `Failed to load unverified count: ${unverifiedRes.error.message}`,
    );
  }
  if (staleProjectsRes.error) {
    throw new Error(
      `Failed to load stale-projects count: ${staleProjectsRes.error.message}`,
    );
  }

  return {
    updatesPendingReview: pendingReviewRes.count ?? 0,
    updatesUnverified: unverifiedRes.count ?? 0,
    staleActiveProjects: staleProjectsRes.count ?? 0,
    staleThresholdIso,
  };
}
