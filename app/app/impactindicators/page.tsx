import IndicatorList from '@/_components/IndicatorList';

export default function ProjectOverview() {
  return (
    <div className='animate-in pt-4 pb-24 max-w-7xl mx-auto'>
      <h2 className='text-2xl font-bold mb-6'>Impact Indicators </h2>
      <div className='w-full p-8 mb-20 text-sm bg-card-bg rounded-lg shadow-lg'>
        <IndicatorList />
      </div>
    </div>
  );
}
