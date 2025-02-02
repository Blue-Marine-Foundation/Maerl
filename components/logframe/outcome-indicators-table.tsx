'use client';

import { useState, useMemo, useCallback } from 'react';
import { OutcomeMeasurable } from '@/utils/types';
import OutcomeMeasurableForm from './outcome-measurable-form';
import ActionButton from '@/components/ui/action-button';
import { Badge } from '@/components/ui/badge';
import {
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
import { extractOutputCodeNumber } from './extractOutputCodeNumber';

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

  const handleEditMeasurable = useCallback((measurable: OutcomeMeasurable) => {
    setSelectedMeasurable(measurable);
    setIsMeasurableDialogOpen(true);
  }, []);

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

  const columns = useMemo(
    () => [
      {
        accessorKey: 'description',
        header: 'Measurable Indicator',
        cell: ({ row }) => (
          <div className='flex flex-row gap-4'>
            <div className='mt-1'>
              <Badge className='bg-emerald-900/90 py-1 font-medium'>
                {extractOutputCodeNumber(row.original.code)}
              </Badge>
            </div>
            <p className='text-sm'>{row.getValue('description')}</p>
          </div>
        ),
        size: 200,
      },
      {
        accessorKey: 'verification',
        header: 'Verification',
        size: 200,
      },
      {
        accessorKey: 'assumptions',
        header: 'Assumptions',
        size: 200,
      },
      // TODO: Test once backend data available for Target and Impact Indicator
      {
        accessorKey: 'target',
        header: 'Target',
        size: 200,
      },
      {
        accessorKey: 'impact_indicator',
        header: 'Impact Indicator',
        size: 200,
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
        size: 10,
      },
    ],
    [handleEditMeasurable],
  );

  const table = useReactTable({
    data: measurables,
    columns,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: 'onChange',
  });

  return (
    <>
      {!measurables ? (
        <div>Loading...</div>
      ) : measurables.length === 0 ? (
        <div className='flex items-center justify-center rounded-md border border-dashed p-12'>
          <ActionButton
            action='add'
            label='Add outcome indicator'
            onClick={handleAddMeasurable}
          />
        </div>
      ) : (
        <div className='flex w-full flex-col items-start gap-4'>
          <div className='w-full rounded-md border'>
            <Table style={{ width: '100%' }}>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        // TODO: decide whether to include border
                        // className='border-r'
                        style={{
                          width: header.column.getSize(),
                        }}
                      >
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
                      <TableCell
                        key={cell.id}
                        // TODO: decide whether to include border
                        // className='border-r'
                        style={{
                          width: cell.column.getSize(),
                        }}
                      >
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
          <div className='flex w-full flex-row items-center justify-start'>
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
