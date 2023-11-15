import { createClient } from '@/_utils/supabase/server';
import { notFound } from 'next/navigation';
import { Params, Measurable, Output } from '@/lib/types';
import Link from 'next/link';

async function Page({ params }: { params: Params }) {
  const supabaseClient = createClient();
  const { data: project, error } = await supabaseClient
    .from('projects')
    .select(`*,updates (*)`)
    .eq('name', params.slug)
    .limit(1);

  if (!project) {
    return (
      <div className='max-w-6xl mx-auto'>
        <h2 className='text-2xl font-bold mb-8'>{`${params.slug} Updates`}</h2>

        <p>No updates found... This is likely an error. </p>
      </div>
    );
  }

  return (
    <>
      <div className='max-w-6xl mx-auto'>
        <h2 className='text-2xl font-bold mb-8'>{`${params.slug} Updates`}</h2>

        <table className='w-full'>
          <tbody>
            {project[0].updates &&
              project[0].updates.map((update) => {
                return (
                  <tr key={update.id} className='border-t border-foreground/20'>
                    <td className='py-4'>{update.date}</td>
                    <td className='py-4'>
                      Output {update.output_measurable_id}
                    </td>
                    <td className='py-4'>{update.type}</td>

                    <td className='py-4'>{update.description}</td>
                    <td className='py-4'>
                      {update.link ? (
                        <Link href={update.link}>Source &rarr;</Link>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Page;
