'use client';

import React, { useState } from 'react';
import { OutputMeasurable } from '@/utils/types';

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
import OutputMeasurableForm from './output-measurable-form';
import { Tab, TabGroup, TabList, TabPanels, TabPanel } from '@headlessui/react';
import { cn } from '@/utils/cn';
import FeatureCard from '../ui/feature-card';
import Link from 'next/link';
import * as d3 from 'd3';
import { createColumns } from './output-indicators-details-table-columns';

export default function OutputIndicatorsDetailsTable({
  measurables,
  outputId,
  projectId,
}: {
  measurables: OutputMeasurable[];
  outputId: number;
  projectId: number;
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

  const handleAddMeasurable = () => {
    if (measurables) {
      const nextIndex = (measurables.length || 0) + 1;
      const nextCode = `OP0.${nextIndex}`;
      setSelectedMeasurable({ code: nextCode } as OutputMeasurable);
      setIsMeasurableDialogOpen(true);
    }
  };

  const toggleRow = (rowId: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [rowId]: !prev[rowId],
    }));
  };

  const columns = createColumns(toggleRow, expandedRows, handleEditMeasurable);

  const table = useReactTable({
    data: measurables,
    columns,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: 'onChange',
  });

  const ExpandableContent = ({
    measurable,
  }: {
    measurable: OutputMeasurable;
  }) => {
    return (
      <div className='mb-8 mt-4 pl-11'>
        <div className='mr-8 rounded-lg border border-slate-400/20'>
          <TabGroup>
            <div className='mb-4 px-4 pt-4'>
              <TabList className='inline-flex space-x-1 rounded-lg bg-slate-800/50 p-1'>
                <Tab
                  className={({ selected }) =>
                    cn(
                      'rounded-md px-3 py-2 text-sm font-medium',
                      'ring-white/10 ring-offset-2 ring-offset-slate-800 focus:outline-none focus:ring-2',
                      selected
                        ? 'bg-slate-700 text-white shadow'
                        : 'text-slate-300 hover:bg-slate-700/50 hover:text-white',
                    )
                  }
                >
                  Updates
                </Tab>
                <Tab
                  className={({ selected }) =>
                    cn(
                      'rounded-md px-3 py-2 text-sm font-medium',
                      'ring-white/10 ring-offset-2 ring-offset-slate-800 focus:outline-none focus:ring-2',
                      selected
                        ? 'bg-slate-700 text-white shadow'
                        : 'text-slate-300 hover:bg-slate-700/50 hover:text-white',
                    )
                  }
                >
                  Activities
                </Tab>
              </TabList>
            </div>

            <TabPanels className='mt-2 px-4 pb-4'>
              <TabPanel>
                {measurable.updates?.length ? (
                  <div className='flex flex-col gap-3'>
                    {measurable.updates.map((update) => (
                      <div
                        className='group flex flex-col gap-2 px-2 py-3.5'
                        key={update.id}
                      >
                        <p className='max-w-prose text-sm text-muted-foreground'>
                          {update.description}
                        </p>
                        <div className='flex items-center gap-3'>
                          <span className='text-xs text-muted-foreground'>
                            {d3.timeFormat('%d %b %Y')(new Date(update.date))}
                          </span>
                          <span className='text-xs text-muted-foreground'>
                            |
                          </span>
                          <Badge
                            variant={
                              update.type === 'Progress'
                                ? 'in_progress'
                                : 'success'
                            }
                            className='px-1.5 py-0 text-xs'
                          >
                            {update.type}
                          </Badge>
                          {!!update.value ? (
                            <>
                              <span className='text-xs text-muted-foreground'>
                                |
                              </span>
                              <span className='text-xs text-muted-foreground'>
                                {`Deliverables: ${update.value}`}
                              </span>
                            </>
                          ) : null}
                          {update.link ? (
                            <>
                              <span className='text-xs text-muted-foreground'>
                                |
                              </span>
                              {update.link && (
                                <Link
                                  href={update.link}
                                  target='_blank'
                                  className='text-xs text-sky-400 hover:underline'
                                >
                                  View evidence
                                </Link>
                              )}
                            </>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <FeatureCard minHeight='24'>
                    <div className='text-muted-foreground'>No updates yet.</div>
                  </FeatureCard>
                )}
              </TabPanel>

              <TabPanel>
                {!measurable.activities?.length ? (
                  <FeatureCard minHeight='24'>
                    <div className='text-muted-foreground'>
                      No activities yet.
                    </div>
                  </FeatureCard>
                ) : (
                  <div className='space-y-3'>
                    {measurable.activities.map((activity) => (
                      <div
                        className='group flex flex-col gap-2 rounded-md border border-slate-700/20 px-6 py-3.5'
                        key={activity.id}
                      >
                        <div className='flex items-start justify-between'>
                          <p className='text-sm text-muted-foreground'>
                            {activity.description}
                          </p>
                          <span className='text-sm text-muted-foreground'>
                            {activity.date}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </div>
      </div>
    );
  };

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
            onClick={handleAddMeasurable}
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
                        'cursor-pointer hover:bg-transparent',
                        expandedRows[row.id] && 'border-b-0',
                      )}
                      onClick={() => toggleRow(row.id)}
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
                          <ExpandableContent measurable={row.original} />
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className='flex w-full flex-row items-center justify-start'>
            <ActionButton
              action='add'
              label='Add output indicator'
              onClick={handleAddMeasurable}
            />
          </div>
        </div>
      )}

      <OutputMeasurableForm
        isOpen={isMeasurableDialogOpen}
        onClose={handleCloseMeasurableDialog}
        measurable={selectedMeasurable}
        outputId={outputId}
        projectId={projectId}
      />
    </>
  );
}
