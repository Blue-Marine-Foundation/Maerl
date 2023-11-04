import IndicatorList from '@/_components/dashboard/IndicatorList';

export default function ProjectOverview() {
  return (
    <div className='max-w-6xl mx-auto'>
      <h2 className='text-2xl font-bold mb-8'>Impact Indicators </h2>
      <div className='w-full p-8 border rounded-lg min-h-[300px] flex flex-col justify-center items-center bg-gray-100 text-gray-500 text-sm dark:bg-gray-800 dark:text-slate-300'>
        <IndicatorList />
      </div>
    </div>
  );
}
