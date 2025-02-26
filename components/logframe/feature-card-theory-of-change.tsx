import { cn } from '@/utils/cn';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export default function FeatureCardTheoryOfChange({
  title,
  children,
  variant,
  tooltipText,
}: {
  title?: string;
  children: React.ReactNode;
  /** card title area background color */
  variant: 'impact' | 'outcome' | 'output';
  tooltipText?: string;
}) {
  return (
    <div className={cn('flex flex-row rounded-md bg-card')}>
      {title && (
        <div
          className={cn(
            'w-64 rounded-l-md p-6',
            variant === 'impact' && 'bg-blue-950/90',
            variant === 'outcome' && 'bg-sky-900/90',
            variant === 'output' && 'bg-sky-600/90',
          )}
        >
          <div className='flex items-center gap-2'>
            <h3 className={cn('text-sm font-medium text-white')}>{title}</h3>
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
      )}

      <div className='flex-1 p-6'>{children}</div>
    </div>
  );
}
