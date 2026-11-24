import { afterEach, expect, test } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import {
  approvedImpactFilters,
  isApprovedImpact,
  updateReviewStatus,
} from '@/utils/update-review';
import IndicatorActualValues from '@/components/logframe/indicator-actual-values';
import type { Update } from '@/utils/types';

afterEach(cleanup);
const accepted = {
  id: 1,
  type: 'Impact',
  admin_reviewed: true,
  valid: true,
  duplicate: false,
  verified: false,
  value: 3,
  impact_indicator_id: 422,
  impact_indicators: {
    id: 422,
    indicator_code: '4.2.2',
    indicator_unit: 'Number of species',
  },
} as Update;

test('a reviewed and valid result counts and is Approved without verification', () => {
  expect(isApprovedImpact(accepted)).toBe(true);
  expect(updateReviewStatus(accepted)).toBe('Approved');
  expect(approvedImpactFilters).toEqual({
    type: 'Impact',
    admin_reviewed: true,
    valid: true,
    duplicate: false,
  });
  render(<IndicatorActualValues updates={[accepted]} />);
  expect(screen.getByText('3 Number of species')).not.toBeNull();
  expect(accepted.verified).toBe(false);
});

test.each([
  [{ admin_reviewed: false, verified: true }, 'Pending Review'],
  [{ valid: false }, 'Invalid'],
  [{ duplicate: true }, 'Duplicate'],
  [{ type: 'Progress' }, ''],
])('other eligibility checks still exclude %o', (changes, status) => {
  const update = { ...accepted, ...changes } as Update;
  expect(isApprovedImpact(update)).toBe(false);
  expect(updateReviewStatus(update)).toBe(status);
});

test('an accepted result with no numeric value does not count', () => {
  expect(
    isApprovedImpact({ ...accepted, value: null } as unknown as Update),
  ).toBe(false);
});
