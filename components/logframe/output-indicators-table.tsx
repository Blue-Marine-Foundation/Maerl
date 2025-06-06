'use client';

import React, { useState } from 'react';
import { OutputMeasurable } from '@/utils/types';

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
import OutputMeasurableForm from './output-measurable-form';
import { cn } from '@/utils/cn';
import { createColumns } from './output-indicators-table-columns';
import OutputIndicatorUpdates from './output-indicator-updates';

export default function OutputIndicatorsDetailsTable({
  measurables,
  outputId,
  projectId,
  outputCode,
  showAddButton = true,
}: {
  measurables: OutputMeasurable[];
  outputId: number;
  projectId: number;
  outputCode: string;
  showAddButton?: boolean;
}) {
  const [isMeasurableDialogOpen, setIsMeasurableDialogOpen] = useState(false);
  const [selectedMeasurable, setSelectedMeasurable] =
    useState<OutputMeasurable | null>(null);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const handleEditMeasurable = (measurable: OutputMeasurable) => {
    setSelectedMeasurable(measurable);
    setIsMeasurableDialogOpen(true);
  };

  const handleCloseMeasurableDialog = () => {
    setIsMeasurableDialogOpen(false);
    setSelectedMeasurable(null);
  };

  const toggleRow = (rowId: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [rowId]: !prev[rowId],
    }));
  };

  const columns = createColumns(
    toggleRow,
    expandedRows,
    handleEditMeasurable,
    projectId.toString(),
  );

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
            label='Add output indicator'
            onClick={() => {
              setSelectedMeasurable(null);
              setIsMeasurableDialogOpen(true);
            }}
          />
        </div>
      ) : (
        <div className='flex w-full flex-col items-start gap-6'>
          <div
            className='w-full rounded-md border'
            style={{ overflow: 'visible' }}
          >
            <Table style={{ width: '100%', overflow: 'visible' }}>
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
                  <React.Fragment key={row.id}>
                    <TableRow
                      className={cn(
                        'hover:bg-transparent',
                        expandedRows[row.id] && 'border-b-0',
                      )}
                    >
                      {row.getVisibleCells().map((cell, index) => (
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
                    {expandedRows[row.id] && (
                      <TableRow className='duration-300 ease-in-out animate-in fade-in hover:bg-transparent'>
                        <TableCell colSpan={columns.length} className='p-0'>
                          <OutputIndicatorUpdates measurable={row.original} />
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
          {showAddButton && (
            <div className='flex w-full flex-row items-center justify-start'>
              <ActionButton
                action='add'
                label='Add output indicator'
                onClick={() => {
                  setSelectedMeasurable(null);
                  setIsMeasurableDialogOpen(true);
                }}
              />
            </div>
          )}
        </div>
      )}

      <OutputMeasurableForm
        isOpen={isMeasurableDialogOpen}
        onClose={handleCloseMeasurableDialog}
        measurable={selectedMeasurable}
        outputId={outputId}
        projectId={projectId}
        existingCodes={measurables.map((m) => m.code)}
        outputCode={outputCode}
      />
    </>
  );
}
