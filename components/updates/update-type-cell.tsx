import type { Update } from '@/utils/types';
import { cn } from '@/utils/cn';
import { UpdateReviewBadge } from './update-status';

export default function UpdateTypeCell({
  update,
  className,
}: {
  update: Update;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col items-start gap-1', className)}>
      <span className='whitespace-nowrap'>{update.type}</span>
      <UpdateReviewBadge update={update} />
    </div>
  );
}
