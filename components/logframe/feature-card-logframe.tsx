import { cn } from '@/utils/cn';

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
          </div>
        </div>
      )}

      <div className='px-4 py-6'>{children}</div>
    </div>
  );
}
