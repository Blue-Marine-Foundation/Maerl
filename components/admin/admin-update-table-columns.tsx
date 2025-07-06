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
import { useState } from 'react';
import { useDebouncedUpdates } from '@/hooks/use-debounced-updates';

// Interactive cell components
const InteractiveVerifiedCell = ({ row }: { row: any }) => {
  const { updateField, isUpdating, getOptimisticValue } = useDebouncedUpdates();
  const updateId = row.original.id;
  const serverValue = row.original.verified;
  const verified = getOptimisticValue(updateId, 'verified', serverValue);

  const handleClick = () => {
    if (isUpdating) return;
    updateField(updateId, 'verified', !verified);
  };

  return (
    <div className='text-center'>
      <button
        onClick={handleClick}
        disabled={isUpdating}
        className={`rounded border px-2 py-1 transition-all hover:opacity-80 disabled:opacity-50 ${
          verified
            ? 'border-green-500/20 bg-green-500/10 text-green-300'
            : 'border-red-500/20 bg-red-500/10 text-red-300'
        }`}
      >
        {verified ? 'Yes' : 'No'}
      </button>
    </div>
  );
};

const InteractiveDuplicateCell = ({ row }: { row: any }) => {
  const { updateField, isUpdating, getOptimisticValue } = useDebouncedUpdates();
  const updateId = row.original.id;
  const serverValue = row.original.duplicate;
  const duplicate = getOptimisticValue(updateId, 'duplicate', serverValue);

  const handleClick = () => {
    if (isUpdating) return;
    updateField(updateId, 'duplicate', !duplicate);
  };

  return (
    <div className='text-center'>
      <button
        onClick={handleClick}
        disabled={isUpdating}
        className={`rounded border px-2 py-1 transition-all hover:opacity-80 disabled:opacity-50 ${
          duplicate
            ? 'border-yellow-500/20 bg-yellow-500/10 text-yellow-300'
            : 'border-gray-500/20 bg-gray-500/10 text-gray-300'
        }`}
      >
        {duplicate ? 'Duplicate' : 'No'}
      </button>
    </div>
  );
};

const InteractiveValidCell = ({ row }: { row: any }) => {
  const { updateField, isUpdating, getOptimisticValue } = useDebouncedUpdates();
  const updateId = row.original.id;
  const serverValue = row.original.valid;
  const valid = getOptimisticValue(updateId, 'valid', serverValue);

  const handleClick = () => {
    if (isUpdating) return;
    updateField(updateId, 'valid', !valid);
  };

  return (
    <div className='text-center'>
      <button
        onClick={handleClick}
        disabled={isUpdating}
        className={`rounded border px-2 py-1 transition-all hover:opacity-80 disabled:opacity-50 ${
          valid
            ? 'border-green-500/20 bg-green-500/10 text-green-300'
            : 'border-red-500/20 bg-red-500/10 text-red-300'
        }`}
      >
        {valid ? 'Yes' : 'No'}
      </button>
    </div>
  );
};

const InteractiveAdminReviewedCell = ({ row }: { row: any }) => {
  const { updateField, isUpdating, getOptimisticValue } = useDebouncedUpdates();
  const updateId = row.original.id;
  const serverValue = row.original.admin_reviewed;
  const adminReviewed = getOptimisticValue(
    updateId,
    'admin_reviewed',
    serverValue,
  );

  const handleClick = () => {
    if (isUpdating) return;
    updateField(updateId, 'admin_reviewed', !adminReviewed);
  };

  return (
    <div className='text-center'>
      <button
        onClick={handleClick}
        disabled={isUpdating}
        className={`rounded border px-2 py-1 transition-all hover:opacity-80 disabled:opacity-50 ${
          adminReviewed
            ? 'border-green-500/20 bg-green-500/10 text-green-300'
            : 'border-red-500/20 bg-red-500/10 text-red-300'
        }`}
      >
        {adminReviewed ? 'Yes' : 'No'}
      </button>
    </div>
  );
};

export const columns: ColumnDef<Update>[] = [
  {
    header: 'Project / Date',
    accessorKey: 'projects.name',
    meta: { widthClass: 'w-36' },
    cell: ({ row }) => (
      <div className='flex flex-col gap-2'>
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
    meta: { widthClass: 'w-20' },
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
    meta: { widthClass: 'w-24' },
  },
  {
    header: 'II Code',
    accessorKey: 'impact_indicators.indicator_code',
    meta: { widthClass: 'w-20' },
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
    meta: { widthClass: 'w-[300px]' },
    cell: ({ row }) => (
      <div className='flex flex-col gap-1'>
        <p>{row.original.description}</p>
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
    meta: { widthClass: 'w-36' },
    cell: ({ row }) => {
      const value = row.original.value;
      const unit = row.original.impact_indicators?.indicator_unit ?? '';
      return (
        <p className='truncate' title={unit}>
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
    meta: { widthClass: 'w-20' },
    cell: ({ row }) => <InteractiveVerifiedCell row={row} />,
  },
  {
    header: 'Duplicate',
    accessorKey: 'duplicate',
    meta: { widthClass: 'w-24' },
    cell: ({ row }) => <InteractiveDuplicateCell row={row} />,
  },
  {
    header: 'Valid',
    accessorKey: 'valid',
    meta: { widthClass: 'w-16' },
    cell: ({ row }) => <InteractiveValidCell row={row} />,
  },
  {
    header: 'Reviewed',
    accessorKey: 'admin_reviewed',
    meta: { widthClass: 'w-20' },
    cell: ({ row }) => <InteractiveAdminReviewedCell row={row} />,
  },
  {
    header: 'Review note',
    accessorKey: 'review_note',
    meta: { widthClass: 'w-32' },
  },
  {
    id: 'edit',
    meta: { widthClass: 'w-16' },
    cell: ({ row }) => {
      const [isOpen, setIsOpen] = useState(false);

      return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
              onSuccess={() => setIsOpen(false)}
            />
          </DialogContent>
        </Dialog>
      );
    },
  },
];
