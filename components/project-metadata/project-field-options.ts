export const CANONICAL_PROJECT_STATUSES = [
  'Pipeline',
  'Active',
  'Complete',
] as const;

export type CanonicalProjectStatus =
  (typeof CANONICAL_PROJECT_STATUSES)[number];

export const CANONICAL_PROJECT_STATUS_SET = new Set<string>(
  CANONICAL_PROJECT_STATUSES,
);

export function normalizeProjectStatus(raw: string | null | undefined): string {
  return raw?.trim() ?? '';
}

export function isCanonicalProjectStatus(
  raw: string | null | undefined,
): boolean {
  const normalized = normalizeProjectStatus(raw);
  return normalized === '' || CANONICAL_PROJECT_STATUS_SET.has(normalized);
}
