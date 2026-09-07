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
      <HoverCardTrigger>
        <UpdateStatus update={update} />
        {indicator?.code}
      </HoverCardTrigger>
      <HoverCardContent>
        <p>{indicator?.description}</p>
      </HoverCardContent>
    </HoverCard>
  );
}
