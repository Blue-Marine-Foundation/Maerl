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
import Link from 'next/link';

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
          <Link
            href={`/${row.original.projects?.project_type?.toLowerCase()}s/${row.original.projects?.slug}`}
            className='hover:underline'
          >
            {row.original.projects?.name}
          </Link>
        </p>
        <p className='text-muted-foreground'>
          {format(row.original.date, 'dd MMM yyyy')}
        </p>
      </div>
    ),
  },
  {
    header: 'Output',
    accessorKey: 'output_measurable_id',
    cell: ({ row }) => {
      const project = row.original.projects?.slug;
      const projectType = row.original.projects?.project_type?.toLowerCase();
      const outputId = row.original.output_measurables?.output_id;
      const link = `/${projectType}s/${project}/logframe#output-${outputId}`;
      return (
        <HoverCard>
          <HoverCardTrigger>
            {row.original.output_measurables?.code}
          </HoverCardTrigger>
          <HoverCardContent className='flex flex-col gap-2'>
            <p>{row.original.output_measurables?.description}</p>
            <Link
              href={link}
              className='text-right text-xs text-blue-400 hover:underline'
            >
              View in logframe
            </Link>
          </HoverCardContent>
        </HoverCard>
      );
    },
  },
  {
    header: 'Update Type',
    accessorKey: 'type',
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
      <div className='flex flex-col gap-1'>
        <p className='w-[270px]'>{row.original.description}</p>
        <p className='text-muted-foreground'>
          Posted by {row.original.users?.first_name}{' '}
          {row.original.users?.last_name}
        </p>
        {row.original.link && (
          <p className='text-blue-400 hover:underline'>
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
    cell: ({ row }) => {
      const verified = row.original.verified;
      return (
        <p className='text-center'>
          {verified ? (
            <span className='rounded border border-green-500/20 bg-green-500/10 px-2 py-1 text-green-300'>
              Yes
            </span>
          ) : (
            <span className='rounded border border-red-500/20 bg-red-500/10 px-2 py-1 text-red-300'>
              No
            </span>
          )}
        </p>
      );
    },
  },
  {
    header: 'Duplicate',
    accessorKey: 'duplicate',
    cell: ({ row }) => {
      const duplicate = row.original.duplicate;
      return (
        <p className='text-center'>
          {duplicate && (
            <span className='rounded border border-yellow-500/20 bg-yellow-500/10 px-2 py-1 text-yellow-300'>
              Duplicate
            </span>
          )}
        </p>
      );
    },
  },
  {
    header: 'Valid',
    accessorKey: 'valid',
    cell: ({ row }) => {
      const valid = row.original.valid;
      return (
        <p className='text-center'>
          {valid ? (
            <span className='rounded border border-green-500/20 bg-green-500/10 px-2 py-1 text-green-300'>
              Yes
            </span>
          ) : (
            <span className='rounded border border-red-500/20 bg-red-500/10 px-2 py-1 text-red-300'>
              No
            </span>
          )}
        </p>
      );
    },
  },
  {
    header: 'Reviewed',
    accessorKey: 'admin_reviewed',
    cell: ({ row }) => {
      const adminReviewed = row.original.admin_reviewed;
      return (
        <p className='text-center'>
          {adminReviewed ? (
            <span className='rounded border border-green-500/20 bg-green-500/10 px-2 py-1 text-green-300'>
              Yes
            </span>
          ) : (
            <span className='rounded border border-red-500/20 bg-red-500/10 px-2 py-1 text-red-300'>
              No
            </span>
          )}
        </p>
      );
    },
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
