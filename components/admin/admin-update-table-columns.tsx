import { Update } from '@/utils/types';
import { ColumnDef } from '@tanstack/react-table';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { format } from 'date-fns';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import UpdateForm from '@/components/updates/update-form';

export const columns: ColumnDef<Update>[] = [
  // {
  //   header: 'Date',
  //   accessorKey: 'date',
  //   cell: ({ row }) => (
  //     <p className='w-20'>{format(row.original.date, 'dd MMM yyyy')}</p>
  //   ),
  // },
  {
    header: 'Project / Date',
    accessorKey: 'projects.name',
    cell: ({ row }) => (
      <div className='flex w-36 flex-col gap-2'>
        <p
          className='truncate text-sm font-medium'
          title={row.original.projects?.name}
        >
          {row.original.projects?.name}
        </p>
        <p className='text-muted-foreground'>
          {format(row.original.date, 'dd MMM yyyy')}
        </p>
      </div>
    ),
  },
  // {
  //   header: 'Project',
  //   accessorKey: 'projects.name',
  //   cell: ({ row }) => (
  //     <div className='flex w-28 flex-col gap-1'>
  //       <p className='truncate font-medium' title={row.original.projects?.name}>
  //         {row.original.projects?.name}
  //       </p>
  //     </div>
  //   ),
  // },
  {
    header: 'Output',
    accessorKey: 'output_measurable_id',
    cell: ({ row }) => (
      <HoverCard>
        <HoverCardTrigger>
          {row.original.output_measurables?.code}
        </HoverCardTrigger>
        <HoverCardContent>
          {row.original.output_measurables?.description}
        </HoverCardContent>
      </HoverCard>
    ),
  },
  {
    header: 'II Code',
    accessorKey: 'impact_indicators.indicator_code',
    cell: ({ row }) => (
      <HoverCard>
        <HoverCardTrigger>
          {row.original.impact_indicators?.indicator_code}
        </HoverCardTrigger>
        <HoverCardContent>
          {row.original.impact_indicators?.indicator_title}
        </HoverCardContent>
      </HoverCard>
    ),
  },

  {
    header: 'Description',
    accessorKey: 'description',
    cell: ({ row }) => (
      <div>
        <p className='w-[300px]'>{row.original.description}</p>

        {row.original.link && (
          <p className='mt-1 text-blue-400 hover:underline'>
            <a href={row.original.link} target='_blank'>
              View linked evidence
            </a>
          </p>
        )}
      </div>
    ),
  },
  {
    header: 'Impact',
    accessorKey: 'value',
    cell: ({ row }) => {
      const value = row.original.value;
      const unit = row.original.impact_indicators?.indicator_unit ?? '';
      return (
        <p className='w-36 truncate' title={unit}>
          {value && (
            <>
              {value.toLocaleString()}{' '}
              <span className='text-muted-foreground'>{unit}</span>
            </>
          )}
        </p>
      );
    },
  },
  {
    header: 'Verified',
    accessorKey: 'verified',
  },
  {
    header: 'Duplicate',
    accessorKey: 'duplicate',
  },
  {
    header: 'Valid',
    accessorKey: 'valid',
  },
  {
    header: 'Reviewed',
    accessorKey: 'admin_reviewed',
  },
  {
    header: 'Review note',
    accessorKey: 'review_note',
  },
  {
    id: 'edit',
    cell: ({ row }) => (
      <Dialog>
        <DialogTrigger asChild>
          <button className='rounded-md border px-2 py-1 text-muted-foreground'>
            Edit
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit update</DialogTitle>
          </DialogHeader>
          <UpdateForm
            outputMeasurable={row.original.output_measurables!}
            impactIndicator={row.original.impact_indicators!}
            projectId={row.original.project_id}
            update={row.original}
            isAdmin={true}
          />
        </DialogContent>
      </Dialog>
    ),
  },
];
