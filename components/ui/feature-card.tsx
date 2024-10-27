import { cn } from '@/utils/cn';

export default function FeatureCard({
  title,
  children,
  minHeight,
}: {
  title?: string;
  minHeight?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'flex flex-col justify-between gap-6 rounded-md bg-card p-4 pb-6',
        minHeight ? `min-h-[${minHeight}]` : 'min-h-64',
      )}
    >
      {title && (
        <h3 className='text-sm font-medium text-muted-foreground'>{title}</h3>
      )}

      {children}
    </div>
  );
}
