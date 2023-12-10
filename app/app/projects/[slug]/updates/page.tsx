import { createClient } from '@/_utils/supabase/server';
import { Params, Update } from '@/lib/types';
import Tooltip from '@/_components/Tooltip';

async function Page({ params }: { params: Params }) {
  const supabaseClient = createClient();
  const { data: project, error } = await supabaseClient
    .from('projects')
    .select(`*,updates (*, output_measurables (*, impact_indicators (*)))`)
    .eq('name', params.slug)
    .limit(1);

  if (!project) {
    console.log(error);
    return (
      <div className='w-full'>
        <h2 className='text-2xl font-bold mb-8'>{`${params.slug} Updates`}</h2>

        <p>No updates found... This is likely an error. </p>
      </div>
    );
  }

  return (
    <>
      <div className='w-full animate-in'>
        <h2 className='text-2xl font-bold mb-8'>Updates</h2>

        {project[0].updates.map((u) => {
          console.log(u.value);
          return (
            <div
              key={u.id}
              className='mb-4 px-4 pt-4 pb-5 bg-card-bg rounded-md flex justify-start'
            >
              <div>
                <div className='text-xs text-foreground/80 font-mono flex justify-start items-center gap-8 mb-4 pt-1.5'>
                  <Tooltip tooltipContent={u.date}>{u.date}</Tooltip>
                  <Tooltip
                    tooltipContent={u.output_measurables.description}
                    tooltipWidth={380}
                  >
                    Output {u.output_measurables.code}
                  </Tooltip>
                  {u.output_measurables.impact_indicators && (
                    <p>{`+${u.value} ${u.output_measurables.unit}`}</p>
                  )}
                  {u.output_measurables.impact_indicators ? (
                    <Tooltip
                      tooltipContent={
                        u.output_measurables.impact_indicators.indicator_title
                      }
                      tooltipWidth={380}
                    >
                      Impact indicator{' '}
                      {u.output_measurables.impact_indicators.indicator_code}
                    </Tooltip>
                  ) : (
                    <p className=''>Progress</p>
                  )}
                </div>

                <p className='text-sm leading-7 max-w-md'>{u.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default Page;
