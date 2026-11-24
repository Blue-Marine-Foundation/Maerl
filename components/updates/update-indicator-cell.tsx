import type { Update } from '@/utils/types';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '../ui/hover-card';
import UpdateStatus from './update-status';

export default function UpdateIndicatorCell({ update }: { update: Update }) {
  const indicator = update.outcome_measurables ?? update.output_measurables;
  return (
    <HoverCard>
      <HoverCardTrigger className='flex w-32 max-w-full flex-col items-start gap-1 text-left'>
        <span className='max-w-full break-words'>{indicator?.code}</span>
        <UpdateStatus
          update={update}
          className='max-w-full flex-col items-start [&>span]:max-w-full [&>span]:break-words [&>span]:px-0 [&>span]:text-xs'
        />
      </HoverCardTrigger>
      <HoverCardContent>
        <p>{indicator?.description}</p>
      </HoverCardContent>
    </HoverCard>
  );
}
