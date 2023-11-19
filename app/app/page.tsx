const things = ['Thing 1', 'Thing 2', 'Another thing', 'Fourth thing'];

export default function Overview() {
  return (
    <>
      <h2 className='text-2xl font-bold mb-8'>Overview</h2>
      <div className='grid grid-cols-2 gap-8'>
        {things.map((thing) => (
          <div className='p-8 border rounded-lg bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-slate-100'>
            <h3 className='text-lg font-bold mb-2'>{thing}</h3>
          </div>
        ))}
      </div>
    </>
  );
}
