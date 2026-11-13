import { afterEach, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LogframePage from '@/app/(protected)/projects/[slug]/logframe/page';
import {
  fetchLogframe,
  fetchUnassignedOutputs,
} from '@/components/logframe/server-actions';

vi.mock('next/navigation', () => ({ useParams: () => ({ slug: 'example' }) }));
vi.mock('@/components/user/user-provider', () => ({
  useUser: () => ({ canEditLogframe: true }),
}));
vi.mock(
  '@/app/(protected)/projects/[slug]/logframe/useLogframeDeeplinking',
  () => ({ useLogframeDeeplinking: () => {} }),
);
vi.mock('@/components/logframe/server-actions', () => ({
  fetchLogframe: vi.fn(),
  fetchUnassignedOutputs: vi.fn(),
}));
vi.mock('@/components/logframe/add-output-button', () => ({
  default: () => <button>Add output</button>,
}));
vi.mock('@/components/logframe/output-card-logframe', () => ({
  default: () => <div>Output</div>,
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
  fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
  await screen.findByRole('button', { name: 'Add output' });
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
