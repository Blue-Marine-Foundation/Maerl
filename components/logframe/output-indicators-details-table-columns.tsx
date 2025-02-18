import { ChevronDown, ChevronRight } from 'lucide-react';
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
          onClick={() => handleEditMeasurable(row.original)}
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
    cell: ({ row }) => {
      const measurable = row.original;
      return (
        <div className='flex flex-col justify-center gap-2'>
          <Dialog>
            <DialogTrigger asChild>
              <ActionButton
                action='add'
                label='Add update'
                className="className='flex w-full items-center justify-center bg-purple-600/20 hover:bg-purple-600/40"
              />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add update</DialogTitle>
              </DialogHeader>
              <UpdateForm
                outputMeasurable={measurable}
                impactIndicator={measurable.impact_indicators!}
                projectId={Number(projectId)}
              />
            </DialogContent>
          </Dialog>
          <button
            onClick={() => toggleRow(row.id)}
            className='flex w-full min-w-[145px] items-center justify-center gap-1 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground dark:text-slate-300 dark:hover:text-slate-100'
          >
            {expandedRows[row.id] ? (
              <>
                <ChevronDown className='h-4 w-4' />
                Hide updates
              </>
            ) : (
              <>
                <ChevronRight className='h-4 w-4' />
                Show updates
              </>
            )}
          </button>
        </div>
      );
    },
  },
];
