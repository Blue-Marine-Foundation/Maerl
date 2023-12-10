import IndicatorList from '@/_components/IndicatorList';

export default function ProjectOverview() {
  return (
    <div className='max-w-6xl mx-auto'>
      <h2 className='text-2xl font-bold mb-8'>Impact Indicators </h2>
      <div className='w-full p-8 mb-20 border rounded-lg min-h-[300px] flex flex-col justify-start items-center bg-card-bg text-sm'>
        <IndicatorList />
      </div>
    </div>
  );
}
