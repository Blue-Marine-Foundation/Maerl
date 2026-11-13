// Shared definition of a "stale" project so the overview count and the
// filtered project list always agree.

export const STALE_THRESHOLD_DAYS = 180;

export const STALE_PROJECTS_FILTER = 'stale';

export function staleThresholdDate(now: Date = new Date()): Date {
  const threshold = new Date(now);
  threshold.setDate(threshold.getDate() - STALE_THRESHOLD_DAYS);
  return threshold;
}

/** Active project with no update recorded, or none since the threshold. */
export function isStaleActiveProject(
  project: { project_status?: string | null; last_updated?: string | null },
  threshold: Date = staleThresholdDate(),
): boolean {
  const status = project.project_status?.toLowerCase() ?? '';
  if (!status.startsWith('active')) return false;
  if (!project.last_updated) return true;
  return new Date(project.last_updated) < threshold;
}
