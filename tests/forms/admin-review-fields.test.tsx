import { beforeEach, expect, test, vi } from 'vitest';
import { updateUpdateFields } from '@/api/update-update-fields';
const db = vi.hoisted(() => ({ update: vi.fn(), result: vi.fn() }));
vi.mock('@/utils/supabase/server', () => ({
  createClient: async () => ({
    auth: { getUser: async () => ({ data: { user: { id: 'admin' } } }) },
    from: (table: string) =>
      table === 'users'
        ? {
            select: () => ({
              eq: () => ({
                single: async () => ({
                  data: { role: 'Super Admin' },
                  error: null,
                }),
              }),
            }),
          }
        : { update: db.update },
  }),
}));
beforeEach(() => {
  vi.clearAllMocks();
  db.update.mockImplementation(() => ({
    eq: () => ({ select: () => ({ single: db.result }) }),
  }));
  db.result.mockResolvedValue({ data: { id: 1 }, error: null });
});
test.each(['valid', 'verified', 'duplicate', 'review_note'])(
  'changing %s does not prematurely finish the review',
  async (field) => {
    await updateUpdateFields([
      {
        updateId: 1,
        field,
        value: field === 'review_note' ? 'Checking evidence' : true,
      },
    ]);
    expect(db.update.mock.calls[0][0]).not.toHaveProperty('admin_reviewed');
  },
);
test('finishing review is explicit and duplicates still invalidate the entry', async () => {
  await updateUpdateFields([
    { updateId: 1, field: 'duplicate', value: true },
    { updateId: 1, field: 'admin_reviewed', value: true },
  ]);
  expect(db.update).toHaveBeenCalledTimes(1);
  expect(db.update.mock.calls[0][0]).toEqual({
    duplicate: true,
    valid: false,
    admin_reviewed: true,
  });
});
