import { CopyIcon, DownloadIcon } from 'lucide-react';
import { Table } from '@tanstack/react-table';

function escapeCSV(value: any): string {
  if (value === null || value === undefined) return '';
  const stringValue = String(value);
  if (
    stringValue.includes(',') ||
    stringValue.includes('"') ||
    stringValue.includes('\n')
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

function getColumnHeader(column: any): string {
  const header = column.columnDef.header;

  if (typeof header === 'string') {
    return header;
  }

  return column.id
    .split('_')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function ExportButton<T>({
  table,
  filename = 'export.csv',
}: {
  table: Table<T>;
  filename?: string;
}) {
  const downloadCSV = () => {
    // Get visible columns
    const visibleColumns = table.getVisibleFlatColumns();

    // Create headers from visible columns
    const headers = visibleColumns
      .map((column) => escapeCSV(getColumnHeader(column)))
      .join(',');

    // Get filtered/sorted rows
    const rows = table.getFilteredRowModel().rows.map((row) =>
      visibleColumns
        .map((column) => {
          const value = row.getValue(column.id);
          return escapeCSV(value);
        })
        .join(','),
    );

    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      className='flex items-center gap-2 rounded-md border px-2 py-1 text-sm'
      onClick={downloadCSV}
    >
      <DownloadIcon className='h-4 w-4' />
      Export
    </button>
  );
}
