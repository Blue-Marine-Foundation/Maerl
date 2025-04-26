import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ActionButton from '@/components/ui/action-button';

interface ArchiveToggleProps {
  isArchived: boolean;
  onArchive: () => Promise<void>;
  onUnarchive: () => Promise<void>;
  canEdit?: boolean;
}

export default function ArchiveToggle({
  isArchived,
  onArchive,
  onUnarchive,
  canEdit = false,
}: ArchiveToggleProps) {
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const archiveMutation = useMutation({
    mutationFn: onArchive,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logframe'] });
      setError(null);
    },
    onError: (error: Error) => {
      setError(error.message || 'Failed to archive');
    },
  });

  const unarchiveMutation = useMutation({
    mutationFn: onUnarchive,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logframe'] });
      setError(null);
    },
    onError: (error: Error) => {
      setError(error.message || 'Failed to unarchive');
    },
  });

  return (
    <div className='flex items-center gap-2'>
      {canEdit && !isArchived && (
        <ActionButton
          action='archive'
          onClick={() => archiveMutation.mutate()}
          className='border-foreground/80 text-sm hover:bg-foreground/10'
        />
      )}
      {canEdit && isArchived && (
        <ActionButton
          action='unarchive'
          onClick={() => unarchiveMutation.mutate()}
          className='border-foreground/80 text-sm hover:bg-foreground/10'
        />
      )}
      {error && (
        <div className='rounded-md border border-red-800 bg-red-600/10 px-4 py-2 text-sm'>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
