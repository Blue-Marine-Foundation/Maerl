import { afterEach, expect, test, vi } from 'vitest';
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import AdminUpdatesDataTable from '@/components/admin/admin-updates-data-table';
import { updateUpdateFields } from '@/api/update-update-fields';
import type { Update } from '@/utils/types';
vi.mock('@/api/update-update-fields', () => ({ updateUpdateFields: vi.fn() }));
vi.mock('@/components/updates/update-form', () => ({ default: () => null }));
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.clearAllMocks();
});
const initial = {
  id: 1,
  date: '2026-10-09',
  description: 'Review test',
  type: 'Impact',
  value: 12,
  verified: false,
  duplicate: false,
  valid: true,
  admin_reviewed: true,
  projects: { name: 'Italy', slug: 'aeolians', project_type: 'Project' },
} as Update;
function cell(name: string) {
  const headers = screen.getAllByRole('columnheader').map((h) => h.textContent);
  const row = screen.getByRole('row', { name: /Review test/ });
  return within(
    within(row).getAllByRole('cell')[headers.indexOf(name)],
  ).getByRole('button');
}
test('a reviewed toggle never flashes its old value during an unrelated refresh', async () => {
  vi.useFakeTimers();
  let server = initial;
  vi.mocked(updateUpdateFields).mockImplementation(async (changes) => {
    server = { ...server, admin_reviewed: false };
    return changes.map((c) => ({ ...c, success: true, data: server }));
  });
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  client.setQueryData(['updates', 'admin'], [initial]);
  function Table() {
    const { data = [] } = useQuery({
      queryKey: ['updates', 'admin'],
      staleTime: Infinity,
      queryFn: () =>
        new Promise<Update[]>((resolve) =>
          setTimeout(() => resolve([server]), 2000),
        ),
    });
    return <AdminUpdatesDataTable updates={data} />;
  }
  render(
    <QueryClientProvider client={client}>
      <Table />
    </QueryClientProvider>,
  );
  fireEvent.click(cell('Reviewed'));
  expect(cell('Reviewed').textContent).toBe('No');
  await act(async () => {
    await vi.advanceTimersByTimeAsync(550);
  });
  await act(async () => {
    client.setQueryData(['unrelated'], { refreshed: true });
    await vi.advanceTimersByTimeAsync(10);
  });
  expect(cell('Reviewed').textContent).toBe('No');
  await act(async () => {
    await vi.advanceTimersByTimeAsync(2500);
  });
  expect(cell('Reviewed').textContent).toBe('No');
});

function showTable(client: QueryClient, fetchRows: () => Promise<Update[]>) {
  client.setQueryData(['updates', 'admin'], [initial]);
  function Table() {
    const { data = [] } = useQuery({
      queryKey: ['updates', 'admin'],
      staleTime: Infinity,
      queryFn: fetchRows,
    });
    return <AdminUpdatesDataTable updates={data} />;
  }
  return render(
    <QueryClientProvider client={client}>
      <Table />
    </QueryClientProvider>,
  );
}

test('rapid edits across cells during a slow save keep the latest choices and serialize requests', async () => {
  vi.useFakeTimers();
  let server = initial;
  let finishFirst!: (value: any) => void;
  vi.mocked(updateUpdateFields)
    .mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finishFirst = resolve;
        }),
    )
    .mockImplementation(async (changes) => {
      server = {
        ...server,
        ...Object.fromEntries(changes.map((c) => [c.field, c.value])),
      };
      return changes.map((c) => ({ ...c, success: true, data: server }));
    });
  const client = new QueryClient();
  showTable(client, async () => [server]);
  fireEvent.click(cell('Reviewed'));
  await act(async () => {
    await vi.advanceTimersByTimeAsync(550);
  });
  fireEvent.click(cell('Verified'));
  fireEvent.click(cell('Reviewed'));
  fireEvent.click(cell('Valid'));
  expect(cell('Verified').textContent).toBe('Yes');
  expect(cell('Reviewed').textContent).toBe('Yes');
  expect(cell('Valid').textContent).toBe('No');
  await act(async () => {
    await vi.advanceTimersByTimeAsync(550);
  });
  expect(updateUpdateFields).toHaveBeenCalledTimes(1);
  await act(async () => {
    server = { ...server, admin_reviewed: false };
    finishFirst([
      { updateId: 1, field: 'admin_reviewed', success: true, data: server },
    ]);
    await vi.advanceTimersByTimeAsync(10);
  });
  expect(updateUpdateFields).toHaveBeenCalledTimes(2);
  expect(server).toMatchObject({
    verified: true,
    valid: false,
    admin_reviewed: true,
  });
  expect(cell('Verified').textContent).toBe('Yes');
  expect(cell('Reviewed').textContent).toBe('Yes');
  expect(cell('Valid').textContent).toBe('No');
});

test('marking Duplicate immediately updates the Valid cell too', async () => {
  vi.useFakeTimers();
  let server = initial;
  vi.mocked(updateUpdateFields).mockImplementation(async (changes) => {
    server = { ...server, duplicate: true, valid: false };
    return changes.map((c) => ({ ...c, success: true, data: server }));
  });
  const client = new QueryClient();
  showTable(client, async () => [server]);
  fireEvent.click(cell('Duplicate'));
  expect(cell('Duplicate').textContent).toBe('Duplicate');
  expect(cell('Valid').textContent).toBe('No');
  await act(async () => {
    await vi.advanceTimersByTimeAsync(550);
  });
  expect(cell('Valid').textContent).toBe('No');
});

test('failed changes roll back and can be retried', async () => {
  vi.useFakeTimers();
  vi.mocked(updateUpdateFields).mockResolvedValue([
    { updateId: 1, field: 'verified', success: false, error: 'Save failed' },
  ]);
  const client = new QueryClient();
  showTable(client, async () => [initial]);
  fireEvent.click(cell('Verified'));
  expect(cell('Verified').textContent).toBe('Yes');
  await act(async () => {
    await vi.advanceTimersByTimeAsync(550);
  });
  expect(cell('Verified').textContent).toBe('No');
  expect(cell('Verified').hasAttribute('disabled')).toBe(false);
});

test('a row hidden by the review filter does not retain stale optimistic values', async () => {
  vi.useFakeTimers();
  let server = { ...initial, admin_reviewed: false };
  vi.mocked(updateUpdateFields).mockImplementation(async (changes) => {
    server = { ...server, admin_reviewed: true };
    return changes.map((c) => ({ ...c, success: true, data: server }));
  });
  const client = new QueryClient();
  client.setQueryData(['updates', 'admin'], [server]);
  function FilteredTable() {
    const { data = [] } = useQuery({
      queryKey: ['updates', 'admin'],
      staleTime: Infinity,
      queryFn: async () => [server],
    });
    return (
      <AdminUpdatesDataTable
        updates={data.filter((u) => !u.admin_reviewed)}
        reviewUpdates={data}
      />
    );
  }
  render(
    <QueryClientProvider client={client}>
      <FilteredTable />
    </QueryClientProvider>,
  );
  fireEvent.click(cell('Reviewed'));
  await act(async () => {
    await vi.advanceTimersByTimeAsync(550);
  });
  expect(screen.queryByRole('row', { name: /Review test/ })).toBeNull();
  await act(async () => {
    server = { ...server, admin_reviewed: false };
    client.setQueryData(['updates', 'admin'], [server]);
    await vi.advanceTimersByTimeAsync(10);
  });
  expect(cell('Reviewed').textContent).toBe('No');
});

test('an older save cannot hide a row whose newer Reviewed choice keeps it in the filter', async () => {
  vi.useFakeTimers();
  let server = { ...initial, admin_reviewed: false };
  let finishFirst!: (value: any) => void;
  let finishSecond!: (value: any) => void;
  vi.mocked(updateUpdateFields)
    .mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finishFirst = resolve;
        }),
    )
    .mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finishSecond = resolve;
        }),
    );
  const client = new QueryClient();
  client.setQueryData(['updates', 'admin'], [server]);
  function FilteredTable() {
    const { data = [] } = useQuery({
      queryKey: ['updates', 'admin'],
      staleTime: Infinity,
      queryFn: async () => [server],
    });
    return (
      <AdminUpdatesDataTable
        updates={data.filter((u) => !u.admin_reviewed)}
        reviewUpdates={data}
      />
    );
  }
  render(
    <QueryClientProvider client={client}>
      <FilteredTable />
    </QueryClientProvider>,
  );
  fireEvent.click(cell('Reviewed'));
  await act(async () => {
    await vi.advanceTimersByTimeAsync(550);
  });
  fireEvent.click(cell('Reviewed'));
  await act(async () => {
    server = { ...server, admin_reviewed: true };
    finishFirst([
      { updateId: 1, field: 'admin_reviewed', success: true, data: server },
    ]);
    await vi.advanceTimersByTimeAsync(10);
  });
  expect(screen.queryByRole('row', { name: /Review test/ })).not.toBeNull();
  expect(cell('Reviewed').textContent).toBe('No');
  await act(async () => {
    server = { ...server, admin_reviewed: false };
    finishSecond([
      { updateId: 1, field: 'admin_reviewed', success: true, data: server },
    ]);
    await vi.advanceTimersByTimeAsync(10);
  });
  expect(cell('Reviewed').textContent).toBe('No');
});
