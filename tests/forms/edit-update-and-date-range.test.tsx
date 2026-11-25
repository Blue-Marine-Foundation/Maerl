import { afterEach, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import EditUpdateDialog from '@/components/updates/edit-update-dialog';
import SetDateRange from '@/components/date-filtering/set-date-range';
import { useUser } from '@/components/user/user-provider';
import { useSearchParams } from 'next/navigation';
import type { Update } from '@/utils/types';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn() }),
  usePathname: () => '/impactindicators/551',
  useSearchParams: vi.fn(),
}));
vi.mock('@/components/user/user-provider', () => ({
  useUser: vi.fn(),
}));
vi.mock('@/api/upsert-updates', () => ({
  upsertUpdate: vi.fn(),
}));
vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

const sampleUpdate = {
  id: 4512,
  project_id: 32,
  date: '2026-05-21',
  type: 'Impact',
  description: 'Careers talk at Earlsfield Primary School',
  value: 15,
  admin_reviewed: true,
  valid: true,
  duplicate: false,
  verified: false,
  output_measurable_id: 493,
  outcome_measurable_id: null,
  output_measurables: {
    id: 493,
    code: 'O.10.3',
    description: 'Careers talks',
  },
  outcome_measurables: null,
  impact_indicators: {
    id: 533,
    indicator_code: '5.3.3',
    indicator_unit: 'Number of stakeholders',
  },
} as unknown as Update;

function renderWithQueryClient(ui: React.ReactElement) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>,
  );
}

test('EditUpdateDialog shows admin review controls for admins and hides them for non-admins', () => {
  vi.mocked(useUser).mockReturnValue({
    isAdmin: true,
  } as ReturnType<typeof useUser>);

  renderWithQueryClient(<EditUpdateDialog update={sampleUpdate} />);
  fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
  expect(screen.getByLabelText('Duplicate')).not.toBeNull();
  expect(screen.getByLabelText('Admin Reviewed')).not.toBeNull();

  cleanup();

  vi.mocked(useUser).mockReturnValue({
    isAdmin: false,
  } as ReturnType<typeof useUser>);

  renderWithQueryClient(<EditUpdateDialog update={sampleUpdate} />);
  fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
  expect(screen.queryByLabelText('Duplicate')).toBeNull();
  expect(screen.queryByLabelText('Admin Reviewed')).toBeNull();
});

test('SetDateRange stays in sync when URL from/to params change', () => {
  vi.mocked(useSearchParams).mockReturnValue(
    new URLSearchParams(
      'from=2026-01-01&to=2026-11-25',
    ) as unknown as ReturnType<typeof useSearchParams>,
  );

  const { rerender } = render(<SetDateRange />);
  expect(screen.getByText('Jan 01, 2026 - Nov 25, 2026')).not.toBeNull();
  expect(
    (screen.getByRole('button', { name: 'Change dates' }) as HTMLButtonElement)
      .disabled,
  ).toBe(true);

  vi.mocked(useSearchParams).mockReturnValue(
    new URLSearchParams(
      'from=2010-01-01&to=2026-11-25',
    ) as unknown as ReturnType<typeof useSearchParams>,
  );

  rerender(<SetDateRange />);
  expect(screen.getByText('Jan 01, 2010 - Nov 25, 2026')).not.toBeNull();
  expect(
    (screen.getByRole('button', { name: 'Change dates' }) as HTMLButtonElement)
      .disabled,
  ).toBe(true);
});
