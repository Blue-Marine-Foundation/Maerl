'use client';

import { useState } from 'react';
import { OutcomeMeasurable } from '@/utils/types';
import OutcomeMeasurableForm from './outcome-measurable-form';
import ActionButton from '@/components/ui/action-button';
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

  const columns = [
    {
      accessorKey: 'description',
      header: 'Measurable Indicator',
      size: 400,
      cell: ({ row }: { row: any }) => (
        <p className='text-sm'>{row.getValue('description')}</p>
      ),
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
    },
    {
      accessorKey: 'impact_indicator_id',
      header: 'Impact Indicator',
      cell: ({ row }: { row: any }) => {
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
      accessorKey: 'actions',
      header: '',
      size: 70,
      cell: ({ row }: { row: any }) => (
        <ActionButton
          action='edit'
          variant='icon'
          className='-mt-1'
          onClick={() => handleEditMeasurable(row.original)}
        />
      ),
    },
  ];

  const table = useReactTable({
    data: measurables,
    columns,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: 'onChange',
  });

  if (!measurables) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {measurables.length === 0 ? (
        <div className='flex items-center justify-center rounded-md border border-dashed p-12'>
          <ActionButton
            action='add'
            label='Add outcome indicator'
            onClick={handleAddMeasurable}
          />
        </div>
      ) : (
        <div className='flex w-full flex-col items-start gap-6'>
          <div className='w-full rounded-md border'>
            <Table style={{ width: '100%' }}>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
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
                        className='text-left align-top'
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
        existingCodes={measurables.map((m) => m.code)}
      />
    </>
  );
}
