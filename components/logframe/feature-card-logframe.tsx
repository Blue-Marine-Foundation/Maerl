import { cn } from '@/utils/cn';
import { useState } from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import Link from 'next/link';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export default function FeatureCardLogframe({
  title,
  children,
  minHeight,
  variant,
  href,
  tooltipText,
}: {
  title?: string;
  minHeight?: string;
  children: React.ReactNode;
  /** card title area background color */
  variant: 'impact' | 'outcome' | 'output';
  href?: string;
  tooltipText?: string;
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div
      className={cn(
        'flex flex-col justify-between rounded-md bg-card',
        minHeight ? `min-h-[${minHeight}]` : 'min-h-64',
      )}
    >
      {title && (
        <div
          className={cn(
            '-mt-0 w-full px-4 py-6',
            'transition-[border-radius] duration-200',
            isExpanded ? 'rounded-t-md' : 'rounded-md',
            variant === 'impact' && 'bg-blue-950/90',
            variant === 'outcome' && 'bg-sky-900/90',
            variant === 'output' && 'bg-sky-600/90',
          )}
        >
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <h3
                className={cn(
                  'text-sm font-medium',
                  href && 'hover:text-foreground',
                )}
              >
                {title}
              </h3>
              {tooltipText && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className='h-4 w-4 text-white/60 hover:text-white' />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className='max-w-xs text-sm'>{tooltipText}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <div className='flex items-center gap-2'>
              {href && (
                <Link
                  href={href}
                  className='rounded-md px-3 py-1.5 text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground active:text-foreground/80'
                >
                  View Output Details
                </Link>
              )}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className='flex items-center gap-2 rounded-md px-2 py-1 text-muted-foreground transition-colors hover:text-foreground active:text-foreground/80'
                aria-label={isExpanded ? 'Collapse section' : 'Expand section'}
              >
                {isExpanded ? (
                  <ChevronUp className='h-5 w-5' />
                ) : (
                  <ChevronDown className='h-5 w-5' />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className={cn(
          'grid transition-all duration-200 ease-in-out',
          isExpanded
            ? 'grid-rows-[1fr] opacity-100'
            : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <div className='overflow-hidden'>
          <div className='px-4 py-6'>{children}</div>
        </div>
      </div>
    </div>
  );
}
