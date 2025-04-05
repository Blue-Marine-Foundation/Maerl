import { useMemo } from 'react';
import { Table } from '@tanstack/react-table';

interface ColumnCountProps<TData> {
  table: Table<TData>;
  columnId: string;
  showLabel?: boolean;
}

export function ColumnCount<TData>({
  table,
  columnId,
  showLabel = true,
}: ColumnCountProps<TData>) {
  const filteredRows = table.getFilteredRowModel().rows;

  const uniqueCount = useMemo(() => {
    const uniqueValues = new Set(
      filteredRows
        .map((row: { getValue: (columnId: string) => unknown }) =>
          row.getValue(columnId),
        )
        .filter(
          (value: unknown) =>
            value !== null && value !== undefined && value !== '',
        ),
    );
    return uniqueValues.size;
  }, [filteredRows, columnId]);

  return showLabel ? <>Count: {uniqueCount}</> : <>{uniqueCount}</>;
}
