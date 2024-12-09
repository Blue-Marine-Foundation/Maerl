import { useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Output, OutputMeasurable } from '@/utils/types';
import ActionButton from '../ui/action-button';
import OutputMeasurableForm from './output-measurable-form';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import UpdateForm from '@/components/updates/update-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function OutputMeasurableTable({ output }: { output: Output }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMeasurable, setSelectedMeasurable] =
    useState<OutputMeasurable | null>(null);

  const handleEditMeasurable = (measurable: OutputMeasurable) => {
    setSelectedMeasurable(measurable);
    setIsDialogOpen(true);
  };

  const handleAddMeasurable = () => {
    setSelectedMeasurable(null);
    setIsDialogOpen(true);
  };

  const columns: ColumnDef<OutputMeasurable>[] = [
    {
      accessorKey: 'code',
      header: 'Code',
      cell: ({ row }) => (
        <span className='font-medium'>{row.getValue('code')}</span>
      ),
    },
    {
      accessorKey: 'impact_indicator_id',
      header: 'Impact Indicator',
      cell: ({ row }) => {
        return (
          <p
            title={row.original.impact_indicators?.indicator_title}
            className='hover:cursor-help'
          >
            {row.original.impact_indicators?.indicator_code}
          </p>
        );
      },
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => {
        return (
          <div className='flex max-w-prose flex-col gap-1 text-base'>
            <p>{row.getValue('description')}</p>
            <p className='text-sm text-muted-foreground'>
              Verification: {row.original.verification}
            </p>
            <p className='text-sm text-muted-foreground'>
              Assumptions: {row.original.assumptions}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: 'target',
      header: 'Target',
    },
    {
      id: 'updates',
      cell: ({ row }) => {
        return (
          <div className='flex justify-end gap-2'>
            <Dialog>
              <DialogTrigger asChild>
                <ActionButton
                  action='add'
                  label='Add update'
                  className='bg-purple-600/20 hover:bg-purple-600/40'
                />
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit update</DialogTitle>
                </DialogHeader>
                <UpdateForm
                  outputMeasurable={row.original}
                  impactIndicator={row.original.impact_indicators!}
                  projectId={row.original.project_id}
                />
              </DialogContent>
            </Dialog>

            <ActionButton
              action='edit'
              variant='icon'
              onClick={() => handleEditMeasurable(row.original)}
            />
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: output.output_measurables || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <h4 className='text-sm font-medium text-muted-foreground'>
          Output Indicators
        </h4>{' '}
        <ActionButton
          action='add'
          label='Add indicator'
          onClick={handleAddMeasurable}
        />
      </div>

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  <p>No indicators yet! Add the first:</p>
                  <ActionButton
                    action='add'
                    label='Add indicator'
                    onClick={handleAddMeasurable}
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <OutputMeasurableForm
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        measurable={selectedMeasurable}
        outputId={output.id}
        projectId={output.project_id}
      />
    </div>
  );
}
