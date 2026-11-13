import type { Update } from '@/utils/types';
import { updateLevel, updateReviewStatus } from '@/utils/update-review';
import { Badge } from '../ui/badge';

export default function UpdateStatus({ update }: { update: Update }) {
  const status = updateReviewStatus(update);
  return (
    <span className='inline-flex flex-wrap gap-1'>
      <Badge variant='outline'>{updateLevel(update)}</Badge>
      {status && <Badge variant='outline'>{status}</Badge>}
    </span>
  );
}
