import { cn } from '@/utils/cn';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function FeatureCardLogframe({
  title,
  children,
  minHeight,
  variant = 'default',
}: {
  title?: string;
  minHeight?: string;
  children: React.ReactNode;
  /** card title area background color */
  variant?: 'default' | 'blue' | 'green' | 'slate';
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
            variant === 'default' && 'bg-card',
            variant === 'blue' && 'bg-blue-950/90',
            variant === 'green' && 'bg-emerald-900/90',
            variant === 'slate' && 'bg-slate-800',
          )}
        >
          <div className='flex items-center justify-between'>
            <h3
              className={cn(
                'text-sm font-medium',
                variant === 'default' && 'text-muted-foreground',
              )}
            >
              {title}
            </h3>
            <div className='flex items-center gap-2'>
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
