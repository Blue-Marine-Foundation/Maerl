'use client';

import { useState, useCallback, useRef } from 'react';
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

export const useDebouncedUpdates = () => {
  const [pendingChanges, setPendingChanges] =
    useState<PendingChange[]>(globalPendingChanges);
  const [isUpdating, setIsUpdating] = useState(globalIsUpdating);
  const queryClient = useQueryClient();

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

      // Keep pending changes for a brief moment to prevent flash during refetch
      setTimeout(() => {
        globalIsUpdating = false;
        globalPendingChanges = [];
        setIsUpdating(false);
        setPendingChanges([]);
      }, 100);
    },
    onError: (error) => {
      toast.error('Failed to save changes');
      console.error('Update error:', error);
    },
    onSettled: () => {
      // Only clear immediately on error, success uses timeout above
      if (mutation.isError) {
        globalIsUpdating = false;
        globalPendingChanges = [];
        setIsUpdating(false);
        setPendingChanges([]);
      }
    },
  });

  const debouncedUpdate = useCallback(() => {
    if (globalTimeoutRef) {
      clearTimeout(globalTimeoutRef);
    }

    globalTimeoutRef = setTimeout(() => {
      if (globalPendingChanges.length > 0) {
        globalIsUpdating = true;
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
