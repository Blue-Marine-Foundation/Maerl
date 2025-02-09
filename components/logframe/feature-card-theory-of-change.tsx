import { cn } from '@/utils/cn';

export default function FeatureCardTheoryOfChange({
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
        'flex flex-row rounded-md bg-card',
        minHeight ? `min-h-[${minHeight}]` : 'min-h-64',
      )}
    >
      {title && (
        <div
          className={cn(
            'w-64 rounded-l-md p-6',
            variant === 'default' && 'bg-card',
            variant === 'blue' && 'bg-blue-950/90',
            variant === 'green' && 'bg-emerald-900/90',
            variant === 'slate' && 'bg-slate-800',
          )}
        >
          <h3
            className={cn(
              'writing-vertical-lr text-sm font-medium',
              variant === 'default' && 'text-muted-foreground',
            )}
          >
            {title}
          </h3>
        </div>
      )}

      <div className='flex-1 p-6'>{children}</div>
    </div>
  );
}
