'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUpdateFields } from '@/api/update-update-fields';
import { toast } from 'sonner';

interface PendingChange {
  updateId: number;
  field: string;
  value: any;
}

// Singleton state to ensure all cells share the same pending changes
let globalPendingChanges: PendingChange[] = [];
let globalIsUpdating = false;
let globalTimeoutRef: NodeJS.Timeout | null = null;
let globalUpdateCount = 0;

export const useDebouncedUpdates = () => {
  const [pendingChanges, setPendingChanges] =
    useState<PendingChange[]>(globalPendingChanges);
  const [isUpdating, setIsUpdating] = useState(globalIsUpdating);
  const queryClient = useQueryClient();
  const updateCountRef = useRef(0);

  const mutation = useMutation({
    mutationFn: (changes: PendingChange[]) => updateUpdateFields(changes),
    onSuccess: (results) => {
      const successCount = results.filter((r) => r.success).length;
      const failureCount = results.filter((r) => !r.success).length;

      if (successCount > 0) {
        toast.success(
          `Updated ${successCount} field${successCount > 1 ? 's' : ''}`,
        );
      }

      if (failureCount > 0) {
        toast.error(
          `Failed to update ${failureCount} field${failureCount > 1 ? 's' : ''}`,
        );
      }

      // Invalidate queries to refresh data
      queryClient.invalidateQueries();

      // Mark that we're waiting for the refetch to complete
      updateCountRef.current = globalUpdateCount;
    },
    onError: (error) => {
      toast.error('Failed to save changes');
      console.error('Update error:', error);
      // Clear immediately on error
      globalIsUpdating = false;
      globalPendingChanges = [];
      setIsUpdating(false);
      setPendingChanges([]);
    },
  });

  // Watch for query updates and clear optimistic state when new data arrives
  useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (event.type === 'updated' && updateCountRef.current > 0) {
        // New data has arrived, clear optimistic state
        globalIsUpdating = false;
        globalPendingChanges = [];
        setIsUpdating(false);
        setPendingChanges([]);
        updateCountRef.current = 0;
      }
    });

    return unsubscribe;
  }, [queryClient]);

  const debouncedUpdate = useCallback(() => {
    if (globalTimeoutRef) {
      clearTimeout(globalTimeoutRef);
    }

    globalTimeoutRef = setTimeout(() => {
      if (globalPendingChanges.length > 0) {
        globalIsUpdating = true;
        globalUpdateCount++;
        setIsUpdating(true);
        mutation.mutate([...globalPendingChanges]);
      }
    }, 500);
  }, [mutation]);

  const updateField = useCallback(
    (updateId: number, field: string, value: any) => {
      // Remove any existing change for this updateId-field combination
      globalPendingChanges = globalPendingChanges.filter(
        (change) => !(change.updateId === updateId && change.field === field),
      );

      // Add the new change
      globalPendingChanges = [
        ...globalPendingChanges,
        { updateId, field, value },
      ];

      // Apply business logic for duplicate field
      if (field === 'duplicate' && value === true) {
        // If marking as duplicate, also set valid to false
        globalPendingChanges = globalPendingChanges.filter(
          (change) =>
            !(change.updateId === updateId && change.field === 'valid'),
        );
        globalPendingChanges = [
          ...globalPendingChanges,
          { updateId, field: 'valid', value: false },
        ];
      }

      setPendingChanges([...globalPendingChanges]);
      debouncedUpdate();
    },
    [debouncedUpdate],
  );

  // Helper function to get optimistic value for a field
  const getOptimisticValue = useCallback(
    (updateId: number, field: string, serverValue: any) => {
      const pendingChange = globalPendingChanges.find(
        (change) => change.updateId === updateId && change.field === field,
      );
      return pendingChange ? pendingChange.value : serverValue;
    },
    [],
  );

  return {
    updateField,
    isUpdating,
    pendingChanges,
    getOptimisticValue,
  };
};
