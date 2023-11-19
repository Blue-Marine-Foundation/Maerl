import { Params } from '@/lib/types';

async function Page({ params }: { params: Params }) {
  return (
    <>
      <div className='max-w-6xl mx-auto'>
        <h2 className='text-2xl font-bold mb-8'>Outputs</h2>
      </div>
    </>
  );
}

export default Page;
