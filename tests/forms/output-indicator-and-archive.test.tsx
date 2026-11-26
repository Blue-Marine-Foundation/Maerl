import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import OutputMeasurableForm from '@/components/logframe/output-measurable-form';
import ImpactIndicatorSelect from '@/components/impact-indicators/impact-indicator-select';
import ArchiveToggle from '@/components/archive-toggle/archive-toggle';
import { upsertOutputMeasurable } from '@/components/logframe/server-actions';
import { fetchImpactIndicators } from '@/components/impact-indicators/server-actions';
import { archiveOutputMeasurable } from '@/components/archive-toggle/server-actions';
import type { OutputMeasurable } from '@/utils/types';

vi.mock('next/navigation', () => ({ useParams: () => ({ slug: 'jersey' }) }));
vi.mock('@/components/logframe/server-actions', () => ({
  upsertOutputMeasurable: vi.fn(),
}));
vi.mock('@/components/impact-indicators/server-actions', () => ({
  fetchImpactIndicators: vi.fn(),
}));
vi.mock('@/components/archive-toggle/server-actions', () => ({
  archiveOutput: vi.fn(),
  unarchiveOutput: vi.fn(),
  archiveOutputMeasurable: vi.fn(),
  unarchiveOutputMeasurable: vi.fn(),
}));

const indicators = [
  {
    id: 221,
    indicator_code: '2.2.1',
    indicator_title: 'Habitats restored',
    indicator_unit: 'ha',
  },
  {
    id: 224,
    indicator_code: '2.2.4',
    indicator_title: 'Oysters deployed',
    indicator_unit: 'oysters',
  },
];

beforeEach(() => {
  vi.mocked(fetchImpactIndicators).mockResolvedValue(indicators as any);
});

afterEach(() => {
  cleanup();
  vi.resetAllMocks();
});

function createClient() {
  const client = new QueryClient({
    defaultOptions: { queries: { staleTime: Infinity, retry: false } },
  });
  client.setQueryData(['impactIndicators'], indicators);
  return client;
}

const sampleMeasurable = {
  id: 4300010202,
  project_id: 43,
  output_id: 43000202,
  code: 'O.2.2',
  description: 'Active restoration including seagrass/saltmarsh',
  impact_indicator_id: 221,
  target: null,
  verification: 'Maps, Photos',
  assumptions: '',
  unit: '',
  archived: false,
} as OutputMeasurable;

test('remapping an output indicator survives parent re-renders and submits the new mapping', async () => {
  const onClose = vi.fn();
  vi.mocked(upsertOutputMeasurable).mockResolvedValue({
    success: true,
    data: { ...sampleMeasurable, impact_indicator_id: 224 },
  });
  const client = createClient();
  const { rerender } = render(
    <QueryClientProvider client={client}>
      <OutputMeasurableForm
        isOpen
        onClose={onClose}
        measurable={sampleMeasurable}
        outputId={43000202}
        projectId={43}
        existingCodes={['O.2.1', 'O.2.2']}
        outputCode='O.2'
      />
    </QueryClientProvider>,
  );

  const select = screen.getByLabelText('Impact Indicator') as HTMLSelectElement;
  fireEvent.change(select, { target: { value: '224' } });
  expect(select.value).toBe('224');

  // Simulate parent refetch creating a fresh existingCodes array reference
  rerender(
    <QueryClientProvider client={client}>
      <OutputMeasurableForm
        isOpen
        onClose={onClose}
        measurable={{ ...sampleMeasurable }}
        outputId={43000202}
        projectId={43}
        existingCodes={['O.2.1', 'O.2.2']}
        outputCode='O.2'
      />
    </QueryClientProvider>,
  );
  expect(
    (screen.getByLabelText('Impact Indicator') as HTMLSelectElement).value,
  ).toBe('224');

  fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
  await waitFor(() =>
    expect(upsertOutputMeasurable).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 4300010202,
        impact_indicator_id: 224,
      }),
    ),
  );
  await waitFor(() => expect(onClose).toHaveBeenCalled());
});

test('OutputMeasurableForm surfaces save errors instead of failing silently', async () => {
  const onClose = vi.fn();
  vi.mocked(upsertOutputMeasurable).mockResolvedValue({
    success: false,
    error: 'Failed to save indicator',
  });
  const client = createClient();
  render(
    <QueryClientProvider client={client}>
      <OutputMeasurableForm
        isOpen
        onClose={onClose}
        measurable={sampleMeasurable}
        outputId={43000202}
        projectId={43}
        existingCodes={['O.2.2']}
        outputCode='O.2'
      />
    </QueryClientProvider>,
  );

  fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
  expect((await screen.findByRole('alert')).textContent).toContain(
    'Failed to save indicator',
  );
  expect(onClose).not.toHaveBeenCalled();
});

test('ImpactIndicatorSelect clears its selected option when value resets to null', () => {
  const client = createClient();
  const onChange = vi.fn();
  const { rerender } = render(
    <QueryClientProvider client={client}>
      <ImpactIndicatorSelect value={221} onChange={onChange} />
    </QueryClientProvider>,
  );
  expect(
    (screen.getByLabelText('Impact Indicator') as HTMLSelectElement).value,
  ).toBe('221');

  rerender(
    <QueryClientProvider client={client}>
      <ImpactIndicatorSelect value={null} onChange={onChange} />
    </QueryClientProvider>,
  );
  expect(
    (screen.getByLabelText('Impact Indicator') as HTMLSelectElement).value,
  ).toBe('');
});

test('archiving an output indicator invalidates unassigned-outputs as well as logframe', async () => {
  vi.mocked(archiveOutputMeasurable).mockResolvedValue({ success: true });
  const client = createClient();
  const invalidateSpy = vi.spyOn(client, 'invalidateQueries');

  render(
    <QueryClientProvider client={client}>
      <ArchiveToggle outputType='output_indicator' data={sampleMeasurable} />
    </QueryClientProvider>,
  );

  // Open dialog via icon button, then confirm archive
  fireEvent.click(screen.getByRole('button'));
  fireEvent.click(screen.getByRole('button', { name: 'Archive' }));

  await waitFor(() =>
    expect(archiveOutputMeasurable).toHaveBeenCalledWith(4300010202, 43),
  );
  await waitFor(() => {
    const keys = invalidateSpy.mock.calls.map((call) => call[0]?.queryKey);
    expect(keys).toContainEqual(['logframe', 'jersey']);
    expect(keys).toContainEqual(['unassigned-outputs', 'jersey']);
    expect(keys).toContainEqual(['archived-output-indicators']);
  });
});

test('a new output indicator recalculates its generated code when existingCodes change without wiping user input', () => {
  const client = createClient();
  const { rerender } = render(
    <QueryClientProvider client={client}>
      <OutputMeasurableForm
        isOpen
        onClose={() => {}}
        measurable={null}
        outputId={43000202}
        projectId={43}
        existingCodes={['O.2.1']}
        outputCode='O.2'
      />
    </QueryClientProvider>,
  );

  expect(screen.getByText('O.2.2')).not.toBeNull();
  fireEvent.change(screen.getByLabelText('Description'), {
    target: { value: 'Draft indicator text' },
  });
  fireEvent.change(screen.getByLabelText('Impact Indicator'), {
    target: { value: '224' },
  });

  // Another user creates O.2.2 and the parent refetches
  rerender(
    <QueryClientProvider client={client}>
      <OutputMeasurableForm
        isOpen
        onClose={() => {}}
        measurable={null}
        outputId={43000202}
        projectId={43}
        existingCodes={['O.2.1', 'O.2.2']}
        outputCode='O.2'
      />
    </QueryClientProvider>,
  );

  expect(screen.getByText('O.2.3')).not.toBeNull();
  expect(
    (screen.getByLabelText('Description') as HTMLTextAreaElement).value,
  ).toBe('Draft indicator text');
  expect(
    (screen.getByLabelText('Impact Indicator') as HTMLSelectElement).value,
  ).toBe('224');
});
