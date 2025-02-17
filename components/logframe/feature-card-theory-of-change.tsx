import { cn } from '@/utils/cn';

export default function FeatureCardTheoryOfChange({
  title,
  children,
  minHeight,
  variant,
}: {
  title?: string;
  minHeight?: string;
  children: React.ReactNode;
  /** card title area background color */
  variant: 'impact' | 'outcome' | 'output';
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
            variant === 'impact' && 'bg-blue-950/90',
            variant === 'outcome' && 'bg-sky-900/90',
            variant === 'output' && 'bg-sky-600/90',
          )}
        >
          <h3
            className={cn('writing-vertical-lr text-sm font-medium text-white')}
          >
            {title}
          </h3>
        </div>
      )}

      <div className='flex-1 p-6'>{children}</div>
    </div>
  );
}
