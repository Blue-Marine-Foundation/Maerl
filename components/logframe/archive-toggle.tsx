import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ActionButton from '@/components/ui/action-button';
import {
  archiveOutput,
  unarchiveOutput,
  archiveOutputMeasurable,
  unarchiveOutputMeasurable,
} from './server-actions';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';

interface ArchiveToggleProps {
  outputType: 'output' | 'output_indicator';
  data: any; // Use appropriate type for output or output_indicator
}

export default function ArchiveToggle({
  outputType,
  data,
}: ArchiveToggleProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const archiveMutation = useMutation({
    mutationFn: async () => {
      console.log('Archiving:', outputType, data);
      if (outputType === 'output') {
        return archiveOutput(data.id, data.projectId);
      } else {
        return archiveOutputMeasurable(data.id, data.projectId);
      }
    },
    onSuccess: () => {
      console.log('Archive successful:', outputType, data);
      queryClient.invalidateQueries({ queryKey: ['logframe'] });
      setIsDialogOpen(false);
    },
    onError: (error: Error) => {
      console.error('Archive error:', error);
      setError(error.message || 'Failed to archive');
    },
  });

  const unarchiveMutation = useMutation({
    mutationFn: async () => {
      console.log('Unarchiving:', outputType, data);
      if (outputType === 'output') {
        return unarchiveOutput(data.id, data.projectId);
      } else {
        return unarchiveOutputMeasurable(data.id, data.projectId);
      }
    },
    onSuccess: (response) => {
      if (response.success) {
        console.log('Unarchive successful:', outputType, data);
        queryClient.invalidateQueries({ queryKey: ['logframe'] });
        setIsDialogOpen(false);
      } else {
        console.error('Unarchive failed:', response.error);
        setError(response.error || 'An error occurred');
      }
    },
    onError: (error: Error) => {
      console.error('Unarchive error:', error);
      setError(error.message || 'Failed to unarchive');
    },
  });

  return (
    <div className='flex items-center gap-2'>
      <ActionButton
        action={data.archived ? 'unarchive' : 'archive'}
        onClick={() => setIsDialogOpen(true)}
        className='border-foreground/80 text-sm hover:bg-foreground/10'
      />
      {error && (
        <div className='rounded-md border border-red-800 bg-red-600/10 px-4 py-2 text-sm'>
          <p>{error}</p>
        </div>
      )}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>
              {data.archived ? 'Unarchive' : 'Archive'}{' '}
              {outputType === 'output' ? 'Output' : 'Output Indicator'}
            </DialogTitle>
          </DialogHeader>
          <div className='py-4'>
            <p>
              Are you sure you want to {data.archived ? 'unarchive' : 'archive'}{' '}
              this {outputType === 'output' ? 'output' : 'output indicator'}?
            </p>
            <p className='mt-2 text-sm text-muted-foreground'>
              This will mark the{' '}
              {outputType === 'output' ? 'output' : 'output indicator'} as{' '}
              {data.archived ? 'unarchived' : 'archived'} and change its status.
            </p>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant='destructive'
              onClick={() =>
                data.archived
                  ? unarchiveMutation.mutate()
                  : archiveMutation.mutate()
              }
              disabled={
                archiveMutation.isPending || unarchiveMutation.isPending
              }
            >
              {archiveMutation.isPending || unarchiveMutation.isPending
                ? data.archived
                  ? 'Unarchiving...'
                  : 'Archiving...'
                : data.archived
                  ? 'Unarchive'
                  : 'Archive'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
