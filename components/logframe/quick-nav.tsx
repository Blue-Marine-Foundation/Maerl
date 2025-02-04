'use client';

import { extractOutputCodeNumber } from './extractOutputCodeNumber';

type LogframeQuickNavProps = {
  projectName?: string;
  impact: boolean;
  outcomes: { id: string }[];
  outputs: { id: string; code?: string }[];
};

export default function LogframeQuickNav({
  projectName,
  impact,
  outcomes,
  outputs,
}: LogframeQuickNavProps) {
  return (
    <nav className='sticky top-4 z-10 rounded-lg bg-background/95 px-4 py-4 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='flex flex-row items-center gap-2'>
        <p className='text-sm text-muted-foreground'>Jump to:</p>
        <div className='flex flex-wrap gap-2'>
          {impact && (
            <a
              href='#impact'
              className='rounded border bg-card px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-gray-100'
            >
              Impact
            </a>
          )}
          {outcomes.map((outcome, index) => (
            <a
              key={outcome.id}
              href={`#outcome-${outcome.id}`}
              className='rounded border bg-card px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-gray-100'
            >
              {`Outcome ${index + 1}`}
            </a>
          ))}
          {outputs.map((output) => (
            <a
              key={output.id}
              href={`#output-${output.id}`}
              className='rounded border bg-card px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-gray-100'
            >
              {output.code?.startsWith('U')
                ? `Unassigned Output ${extractOutputCodeNumber(output.code || '')}`
                : `Output ${extractOutputCodeNumber(output.code || '')}`}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
