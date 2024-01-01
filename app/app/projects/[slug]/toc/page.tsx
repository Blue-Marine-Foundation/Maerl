import { Params } from '@/lib/types';

export default async function TOC({ params }: { params: Params }) {
  return (
    <div className='animate-in pb-24'>
      <h2 className='text-xl font-medium mb-4 text-white'>Theory of Change</h2>
      <div className='min-h-[300px] bg-card-bg flex flex-col justify-center items-center rounded-xl shadow-md'>
        <p className='text-foreground/70'>Coming soon!</p>
      </div>
    </div>
  );
}
