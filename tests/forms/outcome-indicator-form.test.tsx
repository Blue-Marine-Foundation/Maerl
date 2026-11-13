import { afterEach, expect, test, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import OutcomeMeasurableForm from '@/components/logframe/outcome-measurable-form';
import type { OutcomeMeasurable } from '@/utils/types';

vi.mock('@/api/fetch-current-user-profile', () => ({
  fetchCurrentUserProfile: vi.fn(),
}));
vi.mock('@/components/logframe/server-actions', () => ({
  upsertOutcomeMeasurable: vi.fn(),
}));
vi.mock('@/components/impact-indicators/server-actions', () => ({
  fetchImpactIndicators: vi.fn(),
}));
afterEach(cleanup);
const indicator = {
  id: 1,
  indicator_code: '1.1.1',
  indicator_title: 'MPAs',
  indicator_unit: 'MPAs',
};
function showForm(role: string, measurable: OutcomeMeasurable | null) {
  const client = new QueryClient({
    defaultOptions: { queries: { staleTime: Infinity } },
  });
  client.setQueryData(['current-user-profile'], {
    authUser: { id: 'user' },
    profile: { role },
  });
  client.setQueryData(['impactIndicators'], [indicator]);
  render(
    <QueryClientProvider client={client}>
      <OutcomeMeasurableForm
        isOpen
        onClose={() => {}}
        measurable={measurable}
        outcomeId={2}
        projectId={1}
        existingCodes={[]}
      />
    </QueryClientProvider>,
  );
}
test('a new outcome indicator requires an organisational mapping', () => {
  showForm('Project Manager', null);
  const select = screen.getByLabelText('Impact Indicator') as HTMLSelectElement;
  expect(select.required).toBe(true);
  expect(select.checkValidity()).toBe(false);
});
test('a non-admin cannot change an existing outcome mapping', () => {
  showForm('Project Manager', {
    id: 10,
    impact_indicator_id: 1,
    code: 'OC0.1',
  } as OutcomeMeasurable);
  expect(
    (screen.getByLabelText('Impact Indicator') as HTMLSelectElement).disabled,
  ).toBe(true);
});
test('an admin can remap an existing outcome indicator but cannot clear the mapping', () => {
  showForm('Admin', {
    id: 10,
    impact_indicator_id: 1,
    code: 'OC0.1',
  } as OutcomeMeasurable);
  const select = screen.getByLabelText('Impact Indicator') as HTMLSelectElement;
  expect(select.disabled).toBe(false);
  expect(select.required).toBe(true);
});
