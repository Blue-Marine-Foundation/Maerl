import ErrorState from '@/_components/ErrorState';
import ProjectMetaDataRow from '@/_components/project-metadata/project-metadata-row';
import { createClient } from '@/_utils/supabase/server';

export default async function Page() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('projects')
    .select('*, users(*), impacts(*), outcomes(*)')
    .order('id');

  if (error) {
    console.log(error);
    return <ErrorState message={error.message} />;
  }

  return (
    <div className='flex flex-col gap-4 pt-4 pb-12 '>
      <div>
        <h2 className='text-2xl font-medium'>Project Metadata</h2>
      </div>

      <table className='text-xs'>
        <thead className='sticky top-0 bg-background shadow-lg'>
          <tr className=''>
            <td></td>
            <td className='pl-2 pr-1 pt-5 pb-4 align-baseline'>Project</td>
            <td className='pl-2 pr-1 pt-5 pb-4 align-baseline'>
              Regional Strategy
            </td>
            <td className='px-1 pt-5 pb-4 align-baseline'>Start Date</td>
            <td className='px-1 pt-5 pb-4 align-baseline'>Pillars</td>
            <td className='px-1 pt-5 pb-4 align-baseline'>Units</td>
            <td className='px-1 pt-5 pb-4 align-baseline'>
              <div className='flex flex-col gap-1'>
                <p>Project contacts</p>
              </div>
            </td>
            <td className='px-1 pt-5 pb-4 align-baseline'>
              <p>Funding status</p>
            </td>
            <td className='px-1 pt-5 pb-4 align-baseline'>
              <p>Current Funders</p>
            </td>
            <td className='px-1 pt-5 pb-4 align-baseline'>
              <div className='flex flex-col gap-1'>
                <p>Local Contacts</p>
              </div>
            </td>
          </tr>
          <tr>
            <td colSpan={10}>
              <div className='h-[1px] w-full bg-white/80'></div>
            </td>
          </tr>
        </thead>
        <tbody>
          {data.map((entry) => {
            return <ProjectMetaDataRow key={entry.name} entry={entry} />;
          })}
        </tbody>
      </table>
    </div>
  );
}
