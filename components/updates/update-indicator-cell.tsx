import type { Update } from '@/utils/types';
import { updateLevel } from '@/utils/update-review';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '../ui/hover-card';

export default function UpdateIndicatorCell({ update }: { update: Update }) {
  const indicator = update.outcome_measurables ?? update.output_measurables;
  const level = updateLevel(update);
  return (
    <HoverCard>
      <HoverCardTrigger className='flex w-32 max-w-full flex-col items-start gap-0.5 text-left'>
        {indicator?.code && (
          <span className='max-w-full break-words font-medium'>
            {indicator.code}
          </span>
        )}
        <span className='text-xs text-muted-foreground'>{level}</span>
      </HoverCardTrigger>
      {indicator?.description && (
        <HoverCardContent>
          <p>{indicator.description}</p>
        </HoverCardContent>
      )}
    </HoverCard>
  );
}
