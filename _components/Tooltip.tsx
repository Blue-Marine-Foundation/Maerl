import { ReactNode } from 'react';

export default function Tooltip({
  children,
  tooltipContent,
  tooltipWidth,
}: {
  children: ReactNode;
  tooltipContent: string;
  tooltipWidth?: number;
}) {
  return (
    <p className='text-xs font-mono relative group border-b border-b-transparent hover:border-b-foreground/50 hover:cursor-help first-letter:capitalize'>
      {children}
      <span
        style={{ width: tooltipWidth }}
        className='absolute hidden w-fit max-w-96 -translate-x-3/4 -translate-y-full -top-2 -left-0 p-2 rounded-md bg-black text-foreground shadow-lg group-hover:block'
      >
        {tooltipContent}
      </span>
    </p>
  );
}
