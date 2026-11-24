import type { Update } from '@/utils/types';
import { updateLevel, updateReviewStatus } from '@/utils/update-review';
import { Badge } from '../ui/badge';
import { cn } from '@/utils/cn';

export default function UpdateStatus({
  update,
  className,
}: {
  update: Update;
  className?: string;
}) {
  const status = updateReviewStatus(update);
  return (
    <span className={cn('inline-flex flex-wrap gap-1', className)}>
      <Badge variant='outline'>{updateLevel(update)}</Badge>
      {status && <Badge variant='outline'>{status}</Badge>}
    </span>
  );
}
