import { afterEach, expect, test, vi } from 'vitest';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import UpdateForm from '@/components/updates/update-form';
import { upsertUpdate } from '@/api/upsert-updates';
import type { ImpactIndicator, OutcomeMeasurable } from '@/utils/types';

// The server action is the browser's remote submission boundary.
vi.mock('@/api/upsert-updates', () => ({
  upsertUpdate: vi.fn().mockResolvedValue({ update: { id: 1 } }),
}));
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
const impact: ImpactIndicator = {
  id: 1,
  created_at: '',
  indicator_code: '1.1.1',
  indicator_title: 'MPAs',
  indicator_unit: 'MPAs',
};
const outcome: OutcomeMeasurable = {
  id: 10,
  project_id: 1,
  outcome_id: 2,
  code: 'OC0.1',
  description: 'MPAs designated',
  impact_indicator_id: 1,
  impact_indicators: impact,
  assumptions: '',
  verification: 'Published designation',
  target: 2,
};

function showForm() {
  render(
    <QueryClientProvider
      client={
        new QueryClient({ defaultOptions: { mutations: { retry: false } } })
      }
    >
      <UpdateForm
        outcomeMeasurable={outcome}
        impactIndicator={impact}
        projectId={1}
      />
    </QueryClientProvider>,
  );
}

test('an outcome Impact Update cannot be submitted without a description', async () => {
  showForm();
  fireEvent.change(screen.getByLabelText('Value'), { target: { value: '2' } });
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
  await waitFor(() =>
    expect(screen.getByRole('alert').textContent).toContain(
      'Describe the update',
    ),
  );
  expect(upsertUpdate).not.toHaveBeenCalled();
});

test('a review-only save submits no content or mapping changes', async () => {
  const existing = {
    id: 20,
    project_id: 1,
    outcome_measurable_id: 10,
    output_measurable_id: null,
    impact_indicator_id: 1,
    type: 'Impact',
    description: 'Two MPAs designated',
    value: 2,
    date: '2026-09-01',
    source: '',
    link: '',
    verified: true,
    valid: true,
    duplicate: false,
    admin_reviewed: true,
    review_note: '',
    outcome_measurables: outcome,
  } as import('@/utils/types').Update;
  render(
    <QueryClientProvider client={new QueryClient()}>
      <UpdateForm
        update={existing}
        outcomeMeasurable={{ ...outcome, impact_indicator_id: 2 }}
        impactIndicator={impact}
        projectId={1}
        isAdmin
      />
    </QueryClientProvider>,
  );
  fireEvent.change(screen.getByLabelText('Review Note'), {
    target: { value: 'Evidence checked' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));
  await waitFor(() => expect(upsertUpdate).toHaveBeenCalled());
  const submitted = vi.mocked(upsertUpdate).mock.calls[0][0];
  expect(submitted.review_note).toBe('Evidence checked');
  expect(submitted).not.toHaveProperty('source');
  expect(submitted).not.toHaveProperty('description');
  expect(submitted).not.toHaveProperty('impact_indicator_id');
});

test('an outcome Impact Update submits a number, evidence, and only the outcome attachment', async () => {
  showForm();
  fireEvent.change(screen.getByLabelText('Description'), {
    target: { value: 'Two MPAs designated' },
  });
  fireEvent.change(screen.getByLabelText('Value'), { target: { value: '2' } });
  fireEvent.change(screen.getByLabelText('Link'), {
    target: { value: 'https://example.org/designation' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
  await waitFor(() =>
    expect(upsertUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        outcome_measurable_id: 10,
        output_measurable_id: null,
        value: 2,
        type: 'Impact',
        link: 'https://example.org/designation',
      }),
    ),
  );
});

test('an outcome Progress Update submits text without a numeric value', async () => {
  showForm();
  fireEvent.change(screen.getByLabelText('Update type'), {
    target: { value: 'Progress' },
  });
  fireEvent.change(screen.getByLabelText('Description'), {
    target: { value: 'Designation discussions continue' },
  });
  expect(screen.queryByLabelText('Value')).toBeNull();
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
  await waitFor(() =>
    expect(upsertUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        outcome_measurable_id: 10,
        output_measurable_id: null,
        type: 'Progress',
        value: undefined,
      }),
    ),
  );
});

test('output updates use the same form and evidence fields without an outcome attachment', async () => {
  const output = { ...outcome, output_id: 3, unit: 'MPAs', archived: false };
  render(
    <QueryClientProvider client={new QueryClient()}>
      <UpdateForm
        outputMeasurable={output}
        impactIndicator={impact}
        projectId={1}
      />
    </QueryClientProvider>,
  );
  fireEvent.change(screen.getByLabelText('Description'), {
    target: { value: 'Evidence gathered' },
  });
  fireEvent.change(screen.getByLabelText('Value'), { target: { value: '0' } });
  fireEvent.change(screen.getByLabelText('Link'), {
    target: { value: 'https://example.org/evidence' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
  await waitFor(() =>
    expect(upsertUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        output_measurable_id: 10,
        outcome_measurable_id: null,
        value: 0,
        link: 'https://example.org/evidence',
      }),
    ),
  );
});
