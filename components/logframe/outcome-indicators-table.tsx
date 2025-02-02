'use client';

import { useState } from 'react';
import { OutcomeMeasurable } from '@/utils/types';
import OutcomeMeasurableForm from './outcome-measurable-form';
import ActionButton from '@/components/ui/action-button';
import { Badge } from '@/components/ui/badge';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function OutcomeIndicatorsTable({
  measurables,
  outcomeId,
  projectId,
}: {
  measurables: OutcomeMeasurable[];
  outcomeId: number;
  projectId: number;
}) {
  const [isMeasurableDialogOpen, setIsMeasurableDialogOpen] = useState(false);
  const [selectedMeasurable, setSelectedMeasurable] =
    useState<OutcomeMeasurable | null>(null);

  const handleEditMeasurable = (measurable: OutcomeMeasurable) => {
    setSelectedMeasurable(measurable);
    setIsMeasurableDialogOpen(true);
  };

  const handleCloseMeasurableDialog = () => {
    setIsMeasurableDialogOpen(false);
    setSelectedMeasurable(null);
  };

  const handleAddMeasurable = () => {
    if (measurables) {
      const nextIndex = (measurables.length || 0) + 1;
      const nextCode = `OC0.${nextIndex}`;
      setSelectedMeasurable({ code: nextCode } as OutcomeMeasurable);
      setIsMeasurableDialogOpen(true);
    }
  };

  const columns: ColumnDef<OutcomeMeasurable>[] = [
    {
      accessorKey: 'description',
      header: 'Measurable Indicator',
      cell: ({ row }) => (
        <div className='flex flex-row gap-4'>
          <div>
            <Badge className='font-medium'>{row.original.code}</Badge>
          </div>
          <p className='text-sm'>{row.getValue('description')}</p>
        </div>
      ),
    },
    {
      accessorKey: 'verification',
      header: 'Verification',
    },
    {
      accessorKey: 'assumptions',
      header: 'Assumptions',
    },
    // TODO: Test once backend data available for Target and Impact Indicator
    {
      accessorKey: 'target',
      header: 'Target',
    },
    {
      accessorKey: 'impact_indicator',
      header: 'Impact Indicator',
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className='flex justify-end'>
          <ActionButton
            action='edit'
            variant='icon'
            onClick={() => handleEditMeasurable(row.original)}
          />
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: measurables,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      {measurables?.length === 0 ? (
        <div className='flex items-center justify-center rounded-md border border-dashed p-12'>
          <ActionButton
            action='add'
            label='Add outcome indicator'
            onClick={handleAddMeasurable}
          />
        </div>
      ) : (
        <div className='flex flex-col items-start gap-4'>
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
                {table.getRowModel().rows.map((row) => (
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
                ))}
              </TableBody>
            </Table>
          </div>
          <div className='flex flex-row items-center justify-end'>
            <ActionButton
              action='add'
              label='Add outcome indicator'
              onClick={handleAddMeasurable}
            />
          </div>
        </div>
      )}

      <OutcomeMeasurableForm
        isOpen={isMeasurableDialogOpen}
        onClose={handleCloseMeasurableDialog}
        measurable={selectedMeasurable}
        outcomeId={outcomeId}
        projectId={projectId}
      />
    </>
  );
}
