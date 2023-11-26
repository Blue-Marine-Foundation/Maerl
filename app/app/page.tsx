import dayjs from 'dayjs';
import { createClient } from '@/_utils/supabase/server';
import Link from 'next/link';
import Tooltip from '@/_components/Tooltip';

export default async function Overview() {
  const supabase = createClient();

  const relativeTime = require('dayjs/plugin/relativeTime');
  dayjs.extend(relativeTime);

  const { data: user } = await supabase.from('users').select('*');

  const { data: updates, error } = await supabase
    .from('updates')
    .select('*, projects (*), output_measurables (*, impact_indicators (*))')
    .order('date', { ascending: false })
    .limit(15);

  if (error) {
    throw new Error(`Failed to fetch projects: ${error.message}`);
  }

  const shortcuts = [
    {
      name: 'Add Update',
      description: 'Add a new update',
      link: '/app/newupdate',
    },
    {
      name: 'View projects',
      description: 'View project summaries',
      link: '/app/projects',
    },
    {
      name: 'Search impact indicators',
      description: 'Search impact indicators',
      link: '/app/newupdate',
    },
  ];

  return (
    <div className='animate-in'>
      <h2 className='text-2xl font-bold mb-4'>Home</h2>
      <p className='mb-8'>
        Welcome back{user ? `, ${user[0].first_name}!` : '!'}
      </p>
      <div className='flex justify-between gap-20'>
        <div className='py-4 border-t basis-4/6'>
          <h3 className='text-lg font-bold mb-6'>Latest updates</h3>
          {updates.map((u) => {
            // @ts-ignore
            const date = dayjs().to(dayjs(u.date));
            return (
              <div
                key={u.id}
                className='mb-4 px-4 pt-4 pb-5 bg-card-bg rounded-md flex justify-start'
              >
                <div className='w-20'>
                  <span
                    style={{ background: u.projects.highlight_color }}
                    className='py-1 px-2 text-xs text-background rounded-md'
                  >
                    {u.projects.name}
                  </span>
                </div>
                <div>
                  <div className='text-xs text-foreground/80 font-mono flex justify-start items-center gap-8 mb-4 pt-1.5'>
                    <Tooltip tooltipContent={u.date}>{date}</Tooltip>
                    <Tooltip
                      tooltipContent={u.output_measurables.description}
                      tooltipWidth={380}
                    >
                      Output {u.output_measurables.code}
                    </Tooltip>
                    {/* {u.output_measurables.impact_indicators && (
                      <p>
                        {u.value} {u.output_measurables.unit}
                      </p>
                    )} */}
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

                  <p className='text-sm leading-7 max-w-xl'>{u.description}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className='py-4 border-t basis-2/6'>
          <h3 className='text-lg font-bold mb-6'>Shortcuts</h3>
          {shortcuts.map(({ name, description, link }) => {
            return (
              <Link
                href={link}
                key={name}
                className='flex justify-between group rounded-md p-4 mb-6 bg-card-bg text-slate-100 border border-foreground/20 hover:border-foreground/50 transition-all duration-300'
              >
                <p>{description} </p>
                <p className='transition-all duration-300 pr-4 group-hover:pr-1'>
                  &rarr;
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
