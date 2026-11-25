import type { Update } from './types';

export const approvedImpactFilters = {
  type: 'Impact',
  admin_reviewed: true,
  valid: true,
  duplicate: false,
} as const;

export function isApprovedImpact(update: Update): boolean {
  return (
    update.type === 'Impact' &&
    update.admin_reviewed === true &&
    update.valid === true &&
    update.duplicate === false &&
    update.value !== null
  );
}

export function isEligibleProgressUpdate(update: Update): boolean {
  return (
    update.type === 'Progress' &&
    update.valid === true &&
    update.duplicate === false
  );
}

export function isEligibleImpactIndicatorUpdate(update: Update): boolean {
  return isEligibleProgressUpdate(update) || isApprovedImpact(update);
}

export function updateLevel(update: Update): string {
  return update.outcome_measurable_id != null
    ? 'Outcome'
    : update.output_measurable_id != null
      ? 'Output'
      : 'General';
}

export function updateReviewStatus(update: Update): string {
  if (update.type !== 'Impact') return '';
  if (!update.admin_reviewed) return 'Pending Review';
  if (update.duplicate) return 'Duplicate';
  if (!update.valid) return 'Invalid';
  return 'Approved';
}
