import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cn } from '@/utils/cn';
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
import { Output, OutputMeasurable } from '@/utils/types';
import { useParams } from 'next/navigation';

interface ArchiveToggleProps {
  outputType: 'output' | 'output_indicator';
  data: Output | OutputMeasurable;
}

export default function ArchiveToggle({
  outputType,
  data,
}: ArchiveToggleProps) {
  const slug = useParams().slug as string;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const invalidateRelevantQueries = () => {
    if (outputType === 'output') {
      queryClient.invalidateQueries({
        queryKey: ['logframe', slug],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ['unassigned-outputs', slug],
        exact: false,
      });
    } else {
      queryClient.invalidateQueries({
        queryKey: ['logframe', slug],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ['archived-output-indicators'],
        exact: false,
      });
    }
  };

  const archiveMutation = useMutation({
    mutationFn: async () => {
      if (outputType === 'output') {
        return archiveOutput(data.id!, data.project_id);
      } else {
        return archiveOutputMeasurable(data.id!, data.project_id);
      }
    },
    onSettled: (response) => {
      if (response?.success) {
        invalidateRelevantQueries();
        setIsDialogOpen(false);
      } else {
        setError(response?.error || 'An error occurred');
      }
    },
  });

  const unarchiveMutation = useMutation({
    mutationFn: async () => {
      if (outputType === 'output') {
        return unarchiveOutput(data.id!, data.project_id);
      } else {
        return unarchiveOutputMeasurable(data.id!, data.project_id);
      }
    },
    onSuccess: (response) => {
      if (response.success) {
        invalidateRelevantQueries();
        setIsDialogOpen(false);
      } else {
        setError(response.error || 'An error occurred');
      }
    },
    onError: (error: Error) => {
      setError(error.message || 'Failed to unarchive');
    },
  });

  return (
    <div className='flex items-center gap-2'>
      <ActionButton
        action={data.archived ? 'unarchive' : 'archive'}
        onClick={() => setIsDialogOpen(true)}
        className={cn(
          'border text-sm hover:bg-foreground/10',
          outputType === 'output' && 'border-foreground/80',
        )}
        variant={outputType === 'output' ? 'default' : 'icon'}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>
              {data.archived ? 'Unarchive' : 'Archive'}{' '}
              {outputType === 'output' ? 'Output' : 'Output Indicator'}
            </DialogTitle>
          </DialogHeader>
          <div className='space-y-4 py-4'>
            <p>
              Are you sure you want to {data.archived ? 'unarchive' : 'archive'}{' '}
              this {outputType === 'output' ? 'output' : 'output indicator'}?
            </p>
            {error && (
              <div className='rounded-md border border-red-800 bg-red-600/10 px-4 py-2 text-sm'>
                <p>
                  Error attempting to {data.archived ? 'unarchive' : 'archive'}:{' '}
                  {error}
                </p>
              </div>
            )}
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
