import { ChevronDown, ChevronUp } from 'lucide-react';
import { OutputMeasurable } from '@/utils/types';
import { ColumnDef } from '@tanstack/react-table';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import ActionButton from '../ui/action-button';
import UpdateForm from '@/components/updates/update-form';

export const createColumns = (
  toggleRow: (rowId: string) => void,
  expandedRows: Record<string, boolean>,
  handleEditMeasurable: (measurable: OutputMeasurable) => void,
  projectId: string,
): ColumnDef<OutputMeasurable, any>[] => [
  {
    accessorKey: 'description',
    header: 'Measurable Indicator',
    cell: ({ row }) => (
      <div className='flex flex-row items-start gap-4'>
        <ActionButton
          action='edit'
          variant='icon'
          onClick={(e) => {
            e.stopPropagation();
            handleEditMeasurable(row.original);
          }}
          className='flex-shrink-0'
        />
        <p className='text-sm'>{row.getValue('description')}</p>
      </div>
    ),
    size: 300,
  },
  {
    accessorKey: 'verification',
    header: 'Verification',
    size: 250,
  },
  {
    accessorKey: 'assumptions',
    header: 'Assumptions',
    size: 250,
  },
  {
    accessorKey: 'target',
    header: 'Target',
    size: 70,
  },
  {
    accessorKey: 'value',
    header: 'Actual Value',
    size: 70,
  },
  {
    accessorKey: 'impact_indicator_id',
    header: 'Impact Indicator',
    cell: ({ row }) => (
      <p
        title={row.original.impact_indicators?.indicator_title}
        className='hover:cursor-help'
      >
        {row.original.impact_indicators?.indicator_code}
      </p>
    ),
    size: 70,
  },
  {
    id: 'actions',
    header: '',
    size: 200,
    cell: ({ row }) => {
      return (
        <div
          className='flex flex-col items-end gap-2 pr-4'
          onClick={(e) => e.stopPropagation()}
        >
          <Dialog>
            <DialogTrigger asChild>
              <ActionButton
                action='add'
                label='Add update'
                className='flex w-full items-center justify-center bg-purple-600/20 hover:bg-purple-600/40'
              />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add update</DialogTitle>
              </DialogHeader>
              <UpdateForm
                outputMeasurable={row.original}
                impactIndicator={row.original.impact_indicators!}
                projectId={Number(projectId)}
              />
            </DialogContent>
          </Dialog>
          <button
            onClick={() => toggleRow(row.id)}
            className='flex w-full items-center justify-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground transition-all hover:bg-accent hover:text-foreground'
          >
            {expandedRows[row.id] ? (
              <>
                Hide all updates
                <ChevronDown className='h-4 w-4' />
              </>
            ) : (
              <>
                Show all updates
                <ChevronUp className='h-4 w-4' />
              </>
            )}
          </button>
        </div>
      );
    },
  },
];
