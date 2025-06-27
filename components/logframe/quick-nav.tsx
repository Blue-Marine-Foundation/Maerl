'use client';

import { Outcome, Output } from '@/utils/types';
import { extractOutputCodeNumber } from './extractOutputCodeNumber';
import { isUnplannedOutput } from './isUnplannedOutput';
import { useEffect, useRef } from 'react';
import { sortOutputs } from '@/utils/sort-outputs';

type LogframeQuickNavProps = {
  outcomes: Outcome[];
  outputs: Output[];
};

export default function LogframeQuickNav({
  outcomes,
  outputs,
}: LogframeQuickNavProps) {
  const navRef = useRef<HTMLElement>(null);

  // Dynamically set the scroll margin top depending on nav height
  useEffect(() => {
    const updateScrollMargins = () => {
      const navHeight = navRef.current?.offsetHeight || 0;
      const padding = 48;
      const elements = document.querySelectorAll(
        '[id^="impact"], [id^="outcome-"], [id^="output-"]',
      );

      elements.forEach((element) => {
        // Add the new scroll margin
        (element as HTMLElement).style.scrollMarginTop =
          `${navHeight + padding}px`;
      });
    };

    // Run multiple times to ensure proper calculation
    updateScrollMargins();
    // Run after a short delay
    setTimeout(updateScrollMargins, 100);
    // Run after content is likely fully loaded
    setTimeout(updateScrollMargins, 500);

    // Also update when the DOM content is loaded
    document.addEventListener('DOMContentLoaded', updateScrollMargins);
    // Update on resize in case nav height changes
    window.addEventListener('resize', updateScrollMargins);

    return () => {
      window.removeEventListener('resize', updateScrollMargins);
      document.removeEventListener('DOMContentLoaded', updateScrollMargins);
    };
  }, []);

  return (
    <nav
      ref={navRef}
      className='sticky top-4 z-10 rounded-lg bg-background/95 px-4 py-4 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60'
    >
      <div className='flex flex-row items-center gap-2'>
        <p className='text-sm text-muted-foreground'>Jump to:</p>
        <div className='flex flex-wrap gap-2'>
          <a
            href='#impact'
            className='rounded border bg-card px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-black/20 hover:text-foreground active:scale-95 active:bg-accent'
          >
            Impact
          </a>
          {outcomes.map((outcome, index) => (
            <a
              key={outcome.id}
              href={`#outcome-${outcome.id}`}
              className='rounded border bg-card px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-black/20 hover:text-foreground active:scale-95 active:bg-accent'
            >
              {outcomes.length > 1
                ? `Outcome ${extractOutputCodeNumber(outcome.code)}`
                : 'Outcome'}
            </a>
          ))}
          {sortOutputs(outputs).map((output) => (
            <a
              key={output.id}
              href={`#output-${output.id}`}
              className='rounded border bg-card px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-black/20 hover:text-foreground active:scale-95 active:bg-accent'
            >
              {isUnplannedOutput(output)
                ? `Unplanned Output ${extractOutputCodeNumber(output.code || '')}`
                : `Output ${extractOutputCodeNumber(output.code || '')}`}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
