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
        'flex flex-col justify-between gap-6 rounded-md bg-card',
        minHeight ? `min-h-[${minHeight}]` : 'min-h-64',
      )}
    >
      {title && (
        <div
          className={cn(
            '-mt-0 w-full rounded-t-md px-4 py-6',
            variant === 'default' && 'bg-card',
            variant === 'blue' && 'bg-blue-950/90',
            variant === 'green' && 'bg-emerald-900/90',
            variant === 'slate' && 'bg-slate-800',
          )}
        >
          <h3
            className={cn(
              'text-sm font-medium',
              variant === 'default' && 'text-muted-foreground',
            )}
          >
            {title}
          </h3>
        </div>
      )}

      <div className='px-4 pb-6'>{children}</div>
    </div>
  );
}
