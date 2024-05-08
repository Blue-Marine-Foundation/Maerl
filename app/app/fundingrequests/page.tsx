import ErrorState from '@/_components/ErrorState';
import { createClient } from '@/_utils/supabase/server';
import * as d3 from 'd3';
import Link from 'next/link';

export default async function Page() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('funding_requests')
    .select('*, projects(*), outputs(*), users(*)')
    .order('created_at', { ascending: false });

  if (error) {
    console.log(error);
    return (
      <div className='animate-in mb-12 px-24 flex justify-center items-center bg-card-bg rounded-lg shadow'>
        <ErrorState message={error.message} />
      </div>
    );
  }

  return (
    <div className='pt-8 pb-20'>
      <h2 className='mb-8 text-lg font-medium'>Funding Requests</h2>

      {data.length > 0 && (
        <div className='bg-card-bg rounded-lg'>
          {data.map((request) => {
            return (
              <div
                key={request.id}
                className='p-6 text-sm flex justify-between items-baseline gap-4 border-b last-of-type:border-b-transparent'
              >
                <div className='flex items-baseline gap-4'>
                  <div className='w-[190px] shrink-0'>
                    <Link
                      href={`/app/projects/${request.projects.slug}`}
                      className='flex items-center gap-4 mb-1'
                    >
                      <span
                        className='h-2 w-2 rounded-full'
                        style={{ background: request.projects.highlight_color }}
                      ></span>
                      {request.projects.name}
                    </Link>
                    <p className='pl-6 text-xs text-foreground/70'>
                      {d3.timeFormat('%d %b %Y')(new Date(request.date))}
                    </p>
                  </div>
                  <Link
                    href={`/app/projects/${request.projects.slug}/logframe/output?id=${request.outputs.id}&code=${request.outputs.code}`}
                    className='underline mr-8'
                  >
                    Output {request.outputs.code}
                  </Link>
                  <p className='max-w-lg'>{request.detail}</p>
                </div>
                <div className='flex items-baseline gap-4'>
                  <p>
                    <span className='text-xs pr-2'>{request.currency}</span>
                    {d3.format(',.0f')(request.amount)}
                  </p>
                  <p>
                    <span className='text-foreground/70'>Requested by</span>{' '}
                    {request.users && request.users.first_name}{' '}
                    {request.users && request.users.last_name}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
