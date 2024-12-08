'use client';

import React, { useState, useCallback } from 'react';
import { stringify } from 'csv-stringify/sync';
import { CheckIcon, CopyIcon } from 'lucide-react';

export default function CopyToCsvButton({
  data,
  includeHeaders = true,
  label = 'Copy',
}: {
  data: any;
  includeHeaders?: boolean;
  label?: string;
}) {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyClick = useCallback(() => {
    const processedData = data.map(
      (item: { [s: string]: unknown } | ArrayLike<unknown>) =>
        Object.fromEntries(
          Object.entries(item).map(([key, value]) => {
            const formattedValue =
              typeof value === 'string'
                ? value.replace(/(\r\n|\n|\r|\t)/gm, ' ')
                : value;
            return [key, formattedValue];
          }),
        ),
    );

    const csv = stringify(processedData, {
      header: includeHeaders,
      quoted: false,
      quoted_string: true,
    });
    const csvWithBOM = `\uFEFF${csv}`;
    navigator.clipboard.writeText(csvWithBOM).then(() => {
      setCopySuccess(true);
      setTimeout(() => {
        setCopySuccess(false);
      }, 2500);
    });
  }, [data, includeHeaders]);

  return (
    <button
      className={`flex max-w-[5rem] items-center justify-between gap-2 rounded-md border px-3 py-2 text-xs transition-all hover:bg-gray-100/20 ${
        copySuccess && 'bg-green-500/40 hover:bg-green-500/40'
      }`}
      type='button'
      onClick={handleCopyClick}
    >
      {data && copySuccess ? (
        <CheckIcon
          size={14}
          strokeWidth={2.5}
          className='mx-auto text-green-100'
        />
      ) : (
        <CopyIcon size={14} className='mx-auto' />
      )}
      <span>{label}</span>
    </button>
  );
}
