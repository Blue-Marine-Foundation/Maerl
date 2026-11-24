import { afterEach, expect, test, vi } from 'vitest';
import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserSessionSync, useUser } from '@/components/user/user-provider';
import { fetchCurrentUserProfile } from '@/api/fetch-current-user-profile';

const auth = vi.hoisted(() => ({
  listener: null as any,
  unsubscribe: vi.fn(),
}));
vi.mock('@/utils/supabase/client', () => ({
  createClient: () => ({
    auth: {
      onAuthStateChange: (listener: any) => {
        auth.listener = listener;
        return { data: { subscription: { unsubscribe: auth.unsubscribe } } };
      },
    },
  }),
}));
vi.mock('@/api/fetch-current-user-profile', () => ({
  fetchCurrentUserProfile: vi.fn(),
}));
afterEach(() => {
  cleanup();
  vi.resetAllMocks();
});
function Controls() {
  const user = useUser();
  return <>{user.canEditLogframe && <button>Edit indicator</button>}</>;
}
const profile = {
  authUser: { id: 'tester' },
  profile: { role: 'Super Admin' },
};
test('same-user sign-in and token refresh preserve visible edit controls', async () => {
  vi.mocked(fetchCurrentUserProfile).mockResolvedValue(profile as any);
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  render(
    <QueryClientProvider client={client}>
      <UserSessionSync />
      <Controls />
    </QueryClientProvider>,
  );
  await screen.findByRole('button', { name: 'Edit indicator' });
  await act(async () => {
    auth.listener('INITIAL_SESSION', { user: { id: 'tester' } });
  });
  await screen.findByRole('button', { name: 'Edit indicator' });
  vi.mocked(fetchCurrentUserProfile).mockImplementation(
    () => new Promise(() => {}),
  );
  for (const event of ['SIGNED_IN', 'TOKEN_REFRESHED']) {
    await act(async () => {
      auth.listener(event, { user: { id: 'tester' } });
    });
    expect(client.getQueryData(['current-user-profile'])).toEqual(profile);
    expect(
      screen.queryByRole('button', { name: 'Edit indicator' }),
    ).not.toBeNull();
  }
});
test('sign-out clears privileged controls', async () => {
  vi.mocked(fetchCurrentUserProfile).mockResolvedValue(profile as any);
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  render(
    <QueryClientProvider client={client}>
      <UserSessionSync />
      <Controls />
    </QueryClientProvider>,
  );
  await screen.findByRole('button', { name: 'Edit indicator' });
  vi.mocked(fetchCurrentUserProfile).mockResolvedValue({
    authUser: null,
    profile: null,
  } as any);
  await act(async () => {
    auth.listener('SIGNED_OUT', null);
  });
  await waitFor(() =>
    expect(screen.queryByRole('button', { name: 'Edit indicator' })).toBeNull(),
  );
});

test('switching accounts clears the previous account permissions while loading', async () => {
  vi.mocked(fetchCurrentUserProfile).mockResolvedValue(profile as any);
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  render(
    <QueryClientProvider client={client}>
      <UserSessionSync />
      <Controls />
    </QueryClientProvider>,
  );
  await screen.findByRole('button', { name: 'Edit indicator' });
  vi.mocked(fetchCurrentUserProfile).mockImplementation(
    () => new Promise(() => {}),
  );
  await act(async () => {
    auth.listener('SIGNED_IN', { user: { id: 'other-account' } });
  });
  expect(client.getQueryData(['current-user-profile'])).toBeUndefined();
  await waitFor(() =>
    expect(screen.queryByRole('button', { name: 'Edit indicator' })).toBeNull(),
  );
});
