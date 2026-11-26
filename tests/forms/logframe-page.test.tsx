import { afterEach, expect, test, vi } from 'vitest';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LogframePage from '@/app/(protected)/projects/[slug]/logframe/page';
import {
  fetchLogframe,
  fetchUnassignedOutputs,
} from '@/components/logframe/server-actions';

vi.mock('next/navigation', () => ({ useParams: () => ({ slug: 'example' }) }));
const user = vi.hoisted(() => ({ isLoading: false }));
vi.mock('@/components/user/user-provider', () => ({
  useUser: () => ({
    canEditLogframe: !user.isLoading,
    isLoading: user.isLoading,
  }),
}));
const deeplinkSpy = vi.hoisted(() => vi.fn());
vi.mock(
  '@/app/(protected)/projects/[slug]/logframe/useLogframeDeeplinking',
  () => ({ useLogframeDeeplinking: (isReady?: boolean) => deeplinkSpy(isReady) }),
);
vi.mock('@/components/logframe/server-actions', () => ({
  fetchLogframe: vi.fn(),
  fetchUnassignedOutputs: vi.fn(),
}));
vi.mock('@/components/logframe/add-output-button', () => ({
  default: () => <button>Add output</button>,
}));
const outputCardSpy = vi.hoisted(() => vi.fn());
vi.mock('@/components/logframe/output-card-logframe', () => ({
  default: (props: { output: unknown }) => {
    outputCardSpy(props.output);
    return <div>Output</div>;
  },
}));
vi.mock('@/components/logframe/outcome-card-logframe', () => ({
  default: () => <button>Add outcome</button>,
}));
vi.mock('@/components/logframe/impact-card-logframe', () => ({
  default: () => <button>Add impact</button>,
}));
vi.mock('@/components/logframe/quick-nav', () => ({ default: () => null }));
vi.mock('@/components/logframe/feature-card-logframe', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));
afterEach(() => {
  cleanup();
  vi.resetAllMocks();
  user.isLoading = false;
});
const project = {
  data: { id: 1, impacts: [], outcomes: [], outputs: [] },
  error: null,
};
function show() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  render(
    <QueryClientProvider client={client}>
      <LogframePage />
    </QueryClientProvider>,
  );
  return client;
}
test('a returned database error shows an alert instead of an empty editable logframe, and can be retried', async () => {
  vi.mocked(fetchLogframe)
    .mockResolvedValueOnce({
      data: null,
      error: { code: 'PGRST200', message: 'Missing relationship' },
    } as any)
    .mockResolvedValue(project as any);
  vi.mocked(fetchUnassignedOutputs).mockResolvedValue({
    data: null,
    error: null,
  } as any);
  show();
  expect((await screen.findByRole('alert')).textContent).toContain(
    'Unable to load the logframe',
  );
  expect(screen.queryByRole('button', { name: 'Add output' })).toBeNull();
  expect(deeplinkSpy).not.toHaveBeenCalledWith(true);
  fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
  await screen.findByRole('button', { name: 'Add output' });
  expect(deeplinkSpy).toHaveBeenLastCalledWith(true);
});
test('a rejected request is visible', async () => {
  vi.mocked(fetchLogframe).mockRejectedValue(new Error('Network failure'));
  vi.mocked(fetchUnassignedOutputs).mockResolvedValue({
    data: null,
    error: null,
  } as any);
  show();
  await screen.findByRole('alert');
  expect(screen.queryByRole('button', { name: 'Add outcome' })).toBeNull();
});
test('an unassigned-output error does not present an incomplete editable logframe', async () => {
  vi.mocked(fetchLogframe).mockResolvedValue(project as any);
  vi.mocked(fetchUnassignedOutputs).mockResolvedValue({
    data: null,
    error: { message: 'Permission error' },
  } as any);
  show();
  await screen.findByRole('alert');
  expect(screen.queryByRole('button', { name: 'Add output' })).toBeNull();
});
test('a genuinely empty project with no unassigned outputs remains editable', async () => {
  vi.mocked(fetchLogframe).mockResolvedValue(project as any);
  vi.mocked(fetchUnassignedOutputs).mockResolvedValue({
    data: null,
    error: null,
  } as any);
  show();
  await screen.findByRole('button', { name: 'Add output' });
  expect(screen.queryByRole('alert')).toBeNull();
});

test('the initial logframe waits for permissions instead of showing incomplete controls', async () => {
  user.isLoading = true;
  vi.mocked(fetchLogframe).mockResolvedValue(project as any);
  vi.mocked(fetchUnassignedOutputs).mockResolvedValue({
    data: null,
    error: null,
  } as any);
  const client = show();
  await waitFor(() =>
    expect(client.getQueryState(['logframe', 'example'])?.status).toBe(
      'success',
    ),
  );
  await screen.findByText('Loading...');
  expect(screen.queryByRole('button', { name: 'Add outcome' })).toBeNull();
});

test('logframe outputs take precedence over stale unassigned-outputs entries with the same id', async () => {
  vi.mocked(fetchLogframe).mockResolvedValue({
    data: {
      id: 1,
      impacts: [],
      outcomes: [],
      outputs: [
        {
          id: 35000000,
          code: 'U.0',
          archived: false,
          output_measurables: [{ id: 1, code: 'U.1', archived: true }],
        },
      ],
    },
    error: null,
  } as any);
  vi.mocked(fetchUnassignedOutputs).mockResolvedValue({
    data: {
      id: 1,
      outputs: [
        {
          id: 35000000,
          code: 'U.0',
          archived: false,
          output_measurables: [{ id: 1, code: 'U.1', archived: false }],
        },
      ],
    },
    error: null,
  } as any);

  show();
  await screen.findByText('Output');
  expect(outputCardSpy).toHaveBeenCalledWith(
    expect.objectContaining({
      id: 35000000,
      output_measurables: [expect.objectContaining({ id: 1, archived: true })],
    }),
  );
});
