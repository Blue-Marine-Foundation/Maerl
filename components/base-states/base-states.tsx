import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/utils/cn';
export const LoadingCard = ({
  title,
  description,
  skeletonHeight = 'h-32',
}: {
  title?: string;
  description?: string;
  skeletonHeight?: string;
}) => {
  return (
    <div className='space-y-4 rounded-md border bg-card p-4'>
      {title && <h2 className='text-lg font-semibold'>{title}</h2>}
      {description && (
        <p className='text-sm text-muted-foreground'>{description}</p>
      )}
      <Skeleton className={cn('w-full', skeletonHeight)} />
    </div>
  );
};
