import type { Update } from '@/utils/types';
import { updateReviewStatus } from '@/utils/update-review';
import { Badge, type BadgeProps } from '../ui/badge';
import { cn } from '@/utils/cn';

const reviewStatusStyles: Record<
  string,
  { variant: BadgeProps['variant']; className?: string }
> = {
  Approved: { variant: 'success' },
  'Pending Review': { variant: 'delayed' },
  Invalid: {
    variant: 'outline',
    className:
      'border-transparent bg-red-600/10 text-red-700 dark:text-red-400',
  },
  Duplicate: { variant: 'not_started' },
};

export function UpdateReviewBadge({
  update,
  className,
}: {
  update: Update;
  className?: string;
}) {
  const status = updateReviewStatus(update);
  if (!status) return null;
  const style = reviewStatusStyles[status] ?? { variant: 'outline' };

  return (
    <Badge
      variant={style.variant}
      className={cn(
        'whitespace-nowrap px-1.5 py-0.5 text-xs',
        style.className,
        className,
      )}
    >
      {status}
    </Badge>
  );
}

export default function UpdateStatus({
  update,
  className,
}: {
  update: Update;
  className?: string;
}) {
  return (
    <span
      className={cn('inline-flex flex-wrap items-center gap-1.5', className)}
    >
      <Badge
        variant={update.type === 'Progress' ? 'in_progress' : 'secondary'}
        className='whitespace-nowrap px-1.5 py-0.5 text-xs'
      >
        {update.type} update
      </Badge>
      <UpdateReviewBadge update={update} />
    </span>
  );
}
