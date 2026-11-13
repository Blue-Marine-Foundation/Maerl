import type { Update } from '@/utils/types';
import { isApprovedImpact } from '@/utils/update-review';

export default function IndicatorActualValues({
  updates = [],
}: {
  updates?: Update[];
}) {
  const totals = new Map<
    number | null,
    { value: number; indicator?: Update['impact_indicators'] }
  >();
  for (const update of updates.filter(isApprovedImpact)) {
    const previous = totals.get(update.impact_indicator_id);
    totals.set(update.impact_indicator_id, {
      value: (previous?.value ?? 0) + update.value,
      indicator: previous?.indicator ?? update.impact_indicators,
    });
  }

  if (totals.size === 0) return <span>0</span>;
  return (
    <ul className='space-y-1'>
      {Array.from(totals, ([id, { value, indicator }]) => (
        <li key={id ?? 'unmapped'}>
          <span>
            {value} {indicator?.indicator_unit}
          </span>
          <span
            className='block text-xs text-muted-foreground'
            title={indicator?.indicator_title}
          >
            {indicator?.indicator_code ??
              (id === null ? 'Unmapped' : `Impact Indicator ${id}`)}
          </span>
        </li>
      ))}
    </ul>
  );
}
