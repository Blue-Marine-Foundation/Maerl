import { createClient } from '@/_utils/supabase/server';
import { Params, Output } from '@/lib/types';
import LogframeImpactSection from '@/_components/logframe/LogframeImpactSection';
import LogframeOutcomeSection from '@/_components/logframe/LogframeOutcomeSection';

export default async function Logframe({ params }: { params: Params }) {
  const supabaseClient = createClient();
  const { data: project, error } = await supabaseClient
    .from('projects')
    .select(`*, outputs (*)`)
    .eq('slug', params.slug)
    .single();

  if (error) {
    return (
      <div className='animate-in pb-24'>
        <h2 className='text-xl font-medium mb-4 text-white'>Logframe</h2>
        <p>Error fetching logframe: {error.message}</p>
      </div>
    );
  }

  const sections = [
    {
      name: 'Impact',
      slug: 'impact',
    },
    {
      name: 'Outcome',
      slug: 'outcome',
    },
  ];

  const outputs = project.outputs.map((output: Output) => {
    return {
      name: `Output ${output.code}`,
      slug: `output${output.code.replace('.', '')}`,
    };
  });

  const sidenav = [...sections, ...outputs];

  return (
    <div className='animate-in pb-24'>
      <h2 className='text-xl font-medium mb-8 text-white'>Logframe</h2>

      <div className='relative flex justify-between items-start gap-8'>
        <ul className='basis-1/5 shrink-0 sticky top-8'>
          {sidenav.map((item) => {
            return (
              <li key={item.name} className='mb-4'>
                <a href={`#${item.slug}`} className='underline scroll-smooth'>
                  {item.name}
                </a>
              </li>
            );
          })}
        </ul>
        <div className='grow flex flex-col justify-between gap-12'>
          <LogframeImpactSection project_slug={params.slug} />
          <LogframeOutcomeSection project_slug={params.slug} />
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ad
            necessitatibus delectus dolorum cupiditate atque ratione nam
            voluptates voluptatibus voluptas, consequatur assumenda, numquam
            alias consectetur architecto cum laboriosam temporibus quae minus?
          </p>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ad
            necessitatibus delectus dolorum cupiditate atque ratione nam
            voluptates voluptatibus voluptas, consequatur assumenda, numquam
            alias consectetur architecto cum laboriosam temporibus quae minus?
          </p>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ad
            necessitatibus delectus dolorum cupiditate atque ratione nam
            voluptates voluptatibus voluptas, consequatur assumenda, numquam
            alias consectetur architecto cum laboriosam temporibus quae minus?
          </p>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ad
            necessitatibus delectus dolorum cupiditate atque ratione nam
            voluptates voluptatibus voluptas, consequatur assumenda, numquam
            alias consectetur architecto cum laboriosam temporibus quae minus?
          </p>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ad
            necessitatibus delectus dolorum cupiditate atque ratione nam
            voluptates voluptatibus voluptas, consequatur assumenda, numquam
            alias consectetur architecto cum laboriosam temporibus quae minus?
          </p>
        </div>
      </div>
    </div>
  );
}
