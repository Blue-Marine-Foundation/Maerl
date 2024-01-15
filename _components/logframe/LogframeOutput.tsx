import { createClient } from '@/_utils/supabase/server';
import { Measurable, Output } from '@/_lib/types';
import Tooltip from '../Tooltip';
import Link from 'next/link';

export default async function LogframeOutput({
  outputAnchor,
  project_slug,
  output,
}: {
  outputAnchor: string;
  project_slug: string;
  output: Output;
}) {
  const supabase = createClient();

  const { data: outputIndicators, error } = await supabase
    .from('output_measurables')
    .select(`*, impact_indicators(*)`)
    .eq('output_id', output.id);

  return (
    <div id={outputAnchor} className='scroll-m-8'>
      <div className='mb-4 flex justify-start items-center gap-8'>
        <h3 className='text-xl font-medium text-foreground/80'>
          Output {output.code}
        </h3>
        <div className='flex gap-4'>
          <span className='px-3 py-1.5 text-sm border rounded-md'>
            {output.status}
          </span>
          <span className='px-3 py-1.5 text-sm border rounded-md'>
            {output.percentage_complete}% complete
          </span>
        </div>
      </div>

      <p className='text-xl max-w-2xl text-white font-medium mb-6'>
        {output.description}
      </p>
      <ul className='shadow-md'>
        {outputIndicators &&
          outputIndicators
            .sort((a, b) => a.code.localeCompare(b.code))
            .map((om: Measurable) => {
              return (
                <li
                  key={om.id}
                  className='text-sm border-b first-of-type:rounded-t-lg last-of-type:border-b-transparent last-of-type:rounded-b-lg bg-card-bg'
                >
                  <Link
                    href={`/app/projects/${project_slug}/logframe/outputindicator?id=${om.id}&code=${om.code}`}
                    className='p-4 flex justify-start items-baseline gap-8'
                  >
                    <h4 className='basis-1/8 shrink-0 font-semibold text-white'>
                      Indicator {om.code}
                    </h4>
                    <div className='basis 4/8 max-w-lg'>
                      <p className='leading-relaxed text-foreground/80'>
                        {om.description}
                      </p>
                    </div>
                    <div className='grow text-right flex justify-end items-baseline gap-4'>
                      <p>
                        {om.unit && (
                          <span>
                            {om.value}/{om.target} {om.unit}
                          </span>
                        )}
                      </p>
                      <p className='w-[80px]'>
                        {om.impact_indicators ? (
                          <Tooltip
                            tooltipContent={
                              om.impact_indicators.indicator_title
                            }
                            tooltipDirection='right'
                            tooltipWidth={320}
                          >
                            {om.impact_indicators.indicator_code}
                          </Tooltip>
                        ) : (
                          <span className='text-xs font-mono'>Progress</span>
                        )}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
      </ul>
    </div>
  );
}
