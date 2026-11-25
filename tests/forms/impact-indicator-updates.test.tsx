import { afterEach, expect, test, vi } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import IndicatorUpdates from '@/components/impact-indicators/indicator-updates';
import UpdateIndicatorCell from '@/components/updates/update-indicator-cell';
import UpdateTypeCell from '@/components/updates/update-type-cell';
import { fetchImpactIndicatorUpdates } from '@/api/fetch-impact-indicator-updates';
import { useImpactIndicatorUpdates } from '@/hooks/use-impact-indicator-updates';
import { createClient } from '@/utils/supabase/server';
import type { Update } from '@/utils/types';

vi.mock('next/navigation', () => ({
  useParams: () => ({ id: '551' }),
}));
vi.mock('@/hooks/use-impact-indicator-updates', () => ({
  useImpactIndicatorUpdates: vi.fn(),
}));
vi.mock('@/hooks/use-url-projects', () => ({
  useUrlProjects: (projects: string[]) => projects,
}));
vi.mock('@/components/updates/update-form', () => ({ default: () => null }));
vi.mock('@/utils/supabase/server', () => ({
  createClient: vi.fn(),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

const baseUpdate = {
  id: 1,
  project_id: 10,
  date: '2026-10-06',
  type: 'Impact',
  description: 'Approved classroom session',
  value: 95,
  admin_reviewed: true,
  valid: true,
  duplicate: false,
  verified: false,
  output_measurable_id: 84,
  outcome_measurable_id: null,
  projects: { id: 10, name: 'Education', slug: 'education' },
  output_measurables: {
    id: 84,
    code: 'O.8.4',
    description: 'Deliver classroom sessions',
  },
  outcome_measurables: null,
  impact_indicators: {
    id: 551,
    indicator_code: '5.5.1',
    indicator_unit: 'Number of students/general public',
  },
  users: { first_name: 'Kathryn', last_name: 'Smith' },
} as unknown as Update;

test('IndicatorUpdates excludes invalid, duplicate, and pending impact updates and separates indicator from update status', () => {
  const invalidImpact = {
    ...baseUpdate,
    id: 2,
    description: 'Invalid duplicate talk',
    value: 1,
    valid: false,
    admin_reviewed: true,
    output_measurables: { id: 101, code: 'O.10.1', description: 'Talks' },
  } as unknown as Update;

  const pendingImpact = {
    ...baseUpdate,
    id: 3,
    description: 'Pending review talk',
    value: 12,
    valid: false,
    admin_reviewed: false,
  } as unknown as Update;

  const duplicateImpact = {
    ...baseUpdate,
    id: 4,
    description: 'Duplicate talk',
    value: 25,
    valid: false,
    duplicate: true,
    admin_reviewed: true,
  } as unknown as Update;

  const progressUpdate = {
    ...baseUpdate,
    id: 5,
    type: 'Progress',
    description: 'Planned next term workshops',
    value: null,
    valid: true,
    duplicate: false,
    admin_reviewed: false,
  } as unknown as Update;

  vi.mocked(useImpactIndicatorUpdates).mockReturnValue({
    data: [
      baseUpdate,
      invalidImpact,
      pendingImpact,
      duplicateImpact,
      progressUpdate,
    ],
    error: null,
    isLoading: false,
  });

  render(<IndicatorUpdates />);

  expect(screen.getByText('Approved classroom session')).not.toBeNull();
  expect(screen.getByText('Planned next term workshops')).not.toBeNull();
  expect(screen.queryByText('Invalid duplicate talk')).toBeNull();
  expect(screen.queryByText('Pending review talk')).toBeNull();
  expect(screen.queryByText('Duplicate talk')).toBeNull();

  const headers = screen
    .getAllByRole('columnheader')
    .map((header) => header.textContent);
  const approvedRow = screen.getByRole('row', {
    name: /Approved classroom session/,
  });
  const cells = within(approvedRow).getAllByRole('cell');

  const indicatorCell = cells[headers.indexOf('Indicator')];
  const updateCell = cells[headers.indexOf('Update')];

  expect(indicatorCell.textContent).toContain('O.8.4');
  expect(indicatorCell.textContent).toContain('Output');
  expect(indicatorCell.textContent).not.toContain('Approved');

  expect(updateCell.textContent).toContain('Impact');
  expect(updateCell.textContent).toContain('Approved');
});

test('UpdateIndicatorCell never renders update review status; UpdateTypeCell owns it', () => {
  const invalidUpdate = {
    ...baseUpdate,
    valid: false,
    admin_reviewed: true,
    output_measurables: { id: 101, code: 'O.10.1', description: 'Talks' },
  } as unknown as Update;

  render(
    <div>
      <div data-testid='indicator'>
        <UpdateIndicatorCell update={invalidUpdate} />
      </div>
      <div data-testid='update'>
        <UpdateTypeCell update={invalidUpdate} />
      </div>
    </div>,
  );

  expect(screen.getByTestId('indicator').textContent).toContain('O.10.1');
  expect(screen.getByTestId('indicator').textContent).toContain('Output');
  expect(screen.getByTestId('indicator').textContent).not.toContain('Invalid');

  expect(screen.getByTestId('update').textContent).toContain('Impact');
  expect(screen.getByTestId('update').textContent).toContain('Invalid');
});

test('fetchImpactIndicatorUpdates queries only valid, non-duplicate progress or reviewed impact updates', async () => {
  const eqCalls: Array<[string, unknown]> = [];
  const orCalls: string[] = [];
  const builder: Record<string, ReturnType<typeof vi.fn>> = {
    select: vi.fn(),
    eq: vi.fn((col: string, val: unknown) => {
      eqCalls.push([col, val]);
      return builder;
    }),
    or: vi.fn((filter: string) => {
      orCalls.push(filter);
      return builder;
    }),
    gte: vi.fn(),
    lte: vi.fn(),
    order: vi.fn().mockResolvedValue({ data: [], error: null }),
  };
  builder.select.mockReturnValue(builder);
  builder.gte.mockReturnValue(builder);
  builder.lte.mockReturnValue(builder);

  vi.mocked(createClient).mockResolvedValue({
    from: vi.fn(() => builder),
  } as unknown as Awaited<ReturnType<typeof createClient>>);

  await fetchImpactIndicatorUpdates('551', '2026-01-01', '2026-11-25');

  expect(eqCalls).toEqual([
    ['impact_indicator_id', '551'],
    ['valid', true],
    ['duplicate', false],
  ]);
  expect(orCalls).toEqual([
    'type.eq.Progress,and(type.eq.Impact,admin_reviewed.eq.true,value.not.is.null)',
  ]);
});
