'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { updateUpdateFields } from '@/api/update-update-fields';
import type { Update } from '@/utils/types';
import { toast } from 'sonner';

type ReviewField =
  | 'valid'
  | 'verified'
  | 'duplicate'
  | 'admin_reviewed'
  | 'review_note';
interface PendingChange {
  updateId: number;
  field: ReviewField;
  value: boolean | string;
  revision: number;
  saved?: boolean;
}
const fields: ReviewField[] = [
  'valid',
  'verified',
  'duplicate',
  'admin_reviewed',
  'review_note',
];
const keyOf = (change: Pick<PendingChange, 'updateId' | 'field'>) =>
  `${change.updateId}:${change.field}`;

function useReviewQueue(updates: Update[]) {
  const queryClient = useQueryClient();
  const queued = useRef(new Map<string, PendingChange>());
  const displayed = useRef(new Map<string, PendingChange>());
  const revision = useRef(0);
  const running = useRef(false);
  const mounted = useRef(true);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [pendingChanges, setPendingChanges] = useState<PendingChange[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const publish = useCallback(() => {
    if (mounted.current) {
      setPendingChanges(Array.from(displayed.current.values()));
      setIsUpdating(running.current || queued.current.size > 0);
    }
  }, []);

  const flush = useCallback(
    async function saveQueuedChanges(): Promise<void> {
      if (running.current || queued.current.size === 0) return;
      if (timer.current) clearTimeout(timer.current);
      timer.current = null;
      const batch = Array.from(queued.current.values());
      queued.current.clear();
      running.current = true;
      publish();
      try {
        const results = await updateUpdateFields(
          batch.map(({ updateId, field, value }) => ({
            updateId,
            field,
            value,
          })),
        );
        // Stop an older list request from replacing the rows returned by this save.
        await queryClient.cancelQueries({ queryKey: ['updates'] });
        const saved = new Map<number, Update>();
        for (const result of results) {
          const change = batch.find(
            (c) => c.updateId === result.updateId && c.field === result.field,
          )!;
          if (result.success && result.data) {
            saved.set(result.updateId, result.data as Update);
            for (const field of fields) {
              const key = keyOf({ updateId: result.updateId, field });
              const current = displayed.current.get(key);
              // An edit made while this request was running always wins on screen.
              if (!current || current.revision <= change.revision) {
                displayed.current.set(key, {
                  updateId: result.updateId,
                  field,
                  value: result.data[field],
                  revision: change.revision,
                  saved: true,
                });
              }
            }
          } else if (
            displayed.current.get(keyOf(change))?.revision === change.revision
          ) {
            displayed.current.delete(keyOf(change));
          }
        }
        // Do not let filters hide a row based on a superseded review choice.
        const waitingRows = new Set(
          Array.from(queued.current.values(), (change) => change.updateId),
        );
        queryClient.setQueriesData<Update[]>(
          { queryKey: ['updates'] },
          (rows) =>
            Array.isArray(rows)
              ? rows.map((row) =>
                  saved.has(row.id) && !waitingRows.has(row.id)
                    ? { ...row, ...saved.get(row.id) }
                    : row,
                )
              : rows,
        );
        if (saved.size) toast.success('Changes saved');
        if (results.some((r) => !r.success))
          toast.error('Some changes could not be saved. Please try again.');
      } catch {
        for (const change of batch) {
          if (
            displayed.current.get(keyOf(change))?.revision === change.revision
          )
            displayed.current.delete(keyOf(change));
        }
        toast.error('Failed to save changes. Please try again.');
      } finally {
        running.current = false;
        publish();
        if (queued.current.size) {
          // Requests are serialized; a slow older save cannot overwrite a newer one.
          void saveQueuedChanges();
        } else {
          void queryClient.invalidateQueries();
        }
      }
    },
    [publish, queryClient],
  );

  const updateField = useCallback(
    (updateId: number, field: ReviewField, value: boolean | string) => {
      const enqueue = (nextField: ReviewField, nextValue: boolean | string) => {
        const change = {
          updateId,
          field: nextField,
          value: nextValue,
          revision: ++revision.current,
        };
        queued.current.set(keyOf(change), change);
        displayed.current.set(keyOf(change), change);
      };
      enqueue(field, value);
      if (field === 'duplicate' && value === true) enqueue('valid', false);
      publish();
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        void flush();
      }, 500);
    },
    [flush, publish],
  );

  useEffect(() => {
    // Keep saved values visible until the table actually receives them. Query
    // invalidation alone is not evidence that a fresh row has arrived.
    let changed = false;
    for (const [key, change] of Array.from(displayed.current)) {
      if (
        change.saved &&
        updates.some(
          (row) =>
            row.id === change.updateId && row[change.field] === change.value,
        )
      ) {
        displayed.current.delete(key);
        changed = true;
      }
    }
    if (changed) publish();
  }, [updates, pendingChanges, publish]);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (timer.current) clearTimeout(timer.current);
      // Navigating away still saves edits already made, without leaking state
      // into another table or a later visit.
      void flush();
    };
  }, [flush]);

  const getOptimisticValue = (
    updateId: number,
    field: ReviewField,
    serverValue: boolean | string | null,
  ) => displayed.current.get(keyOf({ updateId, field }))?.value ?? serverValue;

  return { updateField, isUpdating, pendingChanges, getOptimisticValue };
}

const ReviewUpdatesContext = createContext<ReturnType<
  typeof useReviewQueue
> | null>(null);

export function ReviewUpdatesProvider({
  updates,
  children,
}: {
  updates: Update[];
  children: React.ReactNode;
}) {
  const value = useReviewQueue(updates);
  return (
    <ReviewUpdatesContext.Provider value={value}>
      {children}
    </ReviewUpdatesContext.Provider>
  );
}

export function useDebouncedUpdates() {
  const context = useContext(ReviewUpdatesContext);
  if (!context)
    throw new Error('Review controls require ReviewUpdatesProvider');
  return context;
}
