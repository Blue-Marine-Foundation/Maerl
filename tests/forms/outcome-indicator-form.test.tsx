import { afterEach, expect, test, vi } from 'vitest';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import OutcomeMeasurableForm from '@/components/logframe/outcome-measurable-form';
import { upsertOutcomeMeasurable } from '@/components/logframe/server-actions';
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
afterEach(() => {
  cleanup();
  vi.resetAllMocks();
});
const indicator = {
  id: 1,
  indicator_code: '1.1.1',
  indicator_title: 'MPAs',
  indicator_unit: 'MPAs',
};
const secondIndicator = {
  id: 2,
  indicator_code: '2.2.1',
  indicator_title: 'Habitats restored',
  indicator_unit: 'ha',
};
function showForm(
  role: string,
  measurable: OutcomeMeasurable | null,
  onClose = () => {},
) {
  const client = new QueryClient({
    defaultOptions: { queries: { staleTime: Infinity } },
  });
  client.setQueryData(['current-user-profile'], {
    authUser: { id: 'user' },
    profile: { role },
  });
  client.setQueryData(['impactIndicators'], [indicator, secondIndicator]);
  const view = render(
    <QueryClientProvider client={client}>
      <OutcomeMeasurableForm
        isOpen
        onClose={onClose}
        measurable={measurable}
        outcomeId={2}
        projectId={1}
        existingCodes={['OC0.1']}
      />
    </QueryClientProvider>,
  );
  return { ...view, client };
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

test('editing a confirmed Progress-only indicator does not require an Impact mapping', () => {
  showForm('Admin', {
    id: 10,
    impact_indicator_id: null,
    progress_only: true,
    code: 'OC.0.3',
  } as OutcomeMeasurable);
  expect(screen.queryByLabelText('Impact Indicator')).toBeNull();
  expect(
    screen.getByText(/Progress only — this indicator accepts written updates/),
  ).not.toBeNull();
});

test('a remapped outcome indicator survives parent re-renders and submits the new mapping', async () => {
  const onClose = vi.fn();
  vi.mocked(upsertOutcomeMeasurable).mockResolvedValue({
    success: true,
    data: { id: 10, impact_indicator_id: 2 } as OutcomeMeasurable,
  });
  const measurable = {
    id: 10,
    impact_indicator_id: 1,
    code: 'OC.0.1',
    description: 'Habitat recovery',
    verification: '',
    assumptions: '',
    target: null,
    outcome_id: 2,
    project_id: 1,
  } as OutcomeMeasurable;
  const { rerender, client } = showForm('Super Admin', measurable, onClose);
  const select = screen.getByLabelText('Impact Indicator') as HTMLSelectElement;
  fireEvent.change(select, { target: { value: '2' } });
  expect(select.value).toBe('2');

  // Parent re-renders with a fresh existingCodes array (e.g. on window-focus refetch)
  rerender(
    <QueryClientProvider client={client}>
      <OutcomeMeasurableForm
        isOpen
        onClose={onClose}
        measurable={{ ...measurable }}
        outcomeId={2}
        projectId={1}
        existingCodes={['OC.0.1']}
      />
    </QueryClientProvider>,
  );
  expect((screen.getByLabelText('Impact Indicator') as HTMLSelectElement).value).toBe('2');

  fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
  await waitFor(() =>
    expect(upsertOutcomeMeasurable).toHaveBeenCalledWith(
      expect.objectContaining({ id: 10, impact_indicator_id: 2 }),
    ),
  );
  await waitFor(() => expect(onClose).toHaveBeenCalled());
});

test('a returned server error is shown to the user without closing the outcome dialog', async () => {
  const onClose = vi.fn();
  vi.mocked(upsertOutcomeMeasurable).mockResolvedValue({
    success: false,
    error: 'Only admins may change the Impact Indicator mapping',
  });
  showForm(
    'Admin',
    {
      id: 10,
      impact_indicator_id: 1,
      code: 'OC.0.1',
      description: 'Habitat recovery',
    } as OutcomeMeasurable,
    onClose,
  );
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
  expect((await screen.findByRole('alert')).textContent).toContain(
    'Only admins may change the Impact Indicator mapping',
  );
  expect(onClose).not.toHaveBeenCalled();
});
