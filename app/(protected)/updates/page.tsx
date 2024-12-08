import UpdatesDataTable from '@/components/updates/updates-data-table';

export default async function UpdatesPages() {
  return (
    <div className='flex flex-col gap-6'>
      <div className='flex items-baseline justify-between'>
        <h2 className='text-xl font-semibold'>Updates</h2>
      </div>
      <UpdatesDataTable />
    </div>
  );
}
