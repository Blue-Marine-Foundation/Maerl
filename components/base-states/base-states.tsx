import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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

export const LoadingStateCard = ({
  title = 'Loading...',
  description,
  skeletonHeight = 'h-32',
}: {
  title?: string;
  description?: string;
  skeletonHeight?: string;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg font-semibold'>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className={skeletonHeight}>
        <Skeleton className='h-full w-full' />
      </CardContent>
    </Card>
  );
};

export const EmptyStateCard = ({
  title = 'No data',
  description,
  emptyMessage = 'No data found for the active filters',
}: {
  title?: string;
  description?: string;
  emptyMessage?: string;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg font-semibold'>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className='rounded-md border border-sky-100 bg-sky-500/10 p-4'>
          <p className='text-sm text-muted-foreground'>{emptyMessage}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export const ErrorStateCard = ({
  title = 'Error',
  errorMessage = 'Apologies, an unknown error occurred while loading data',
  description,
}: {
  title?: string;
  errorMessage?: string;
  description?: string;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg font-semibold'>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className='flex h-full items-center justify-center rounded-md border border-rose-500/20 bg-red-500/10 p-4 text-rose-800'>
          <p className='text-sm text-muted-foreground'>{errorMessage}</p>
        </div>
      </CardContent>
    </Card>
  );
};
