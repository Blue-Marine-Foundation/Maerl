import { cn } from '@/utils/cn';
import { Info } from 'lucide-react';
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
            'rounded-t-md',
            variant === 'impact' && 'bg-blue-950/90',
            variant === 'outcome' && 'bg-sky-900/90',
            variant === 'output' && 'bg-sky-600/90',
          )}
        >
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <h3 className={cn('text-sm font-medium')}>{title}</h3>
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
          </div>
        </div>
      )}

      <div className='px-4 py-6'>{children}</div>
    </div>
  );
}
