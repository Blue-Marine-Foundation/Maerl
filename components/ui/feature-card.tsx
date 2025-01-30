import { cn } from '@/utils/cn';

export default function FeatureCard({
  title,
  children,
  minHeight,
  variant = 'default',
}: {
  title?: string;
  minHeight?: string;
  children: React.ReactNode;
  /** card background color */
  variant?: 'default' | 'blue' | 'green' | 'slate';
}) {
  console.log({ minHeight });
  return (
    <div
      className={cn(
        'flex flex-col justify-between gap-6 rounded-md p-4 pb-6',
        minHeight ? `min-h-[${minHeight}]` : 'min-h-64',
        variant === 'default' && 'bg-card',
        variant === 'blue' && 'bg-blue-950/90',
        variant === 'green' && 'bg-emerald-900/90',
        variant === 'slate' && 'bg-slate-800',
      )}
    >
      {title && (
        <h3
          className={cn(
            'text-sm font-medium',
            variant === 'default' && 'text-muted-foreground',
          )}
        >
          {title}
        </h3>
      )}

      {children}
    </div>
  );
}
