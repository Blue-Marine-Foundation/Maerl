export default function ErrorState({ message }: { message: string }) {
  return (
    <div className='animate-in pt-8 py-20'>
      <div className='bg-card-bg p-20 flex flex-col items-center gap-4 rounded-lg'>
        <h2 className='font-semibold'>Error loading data (sorry!)</h2>
        <p>Please screenshot the page and forward it to the SII team:</p>
        <p className='px-2 py-1 text-xs bg-slate-600 rounded-md'>
          <code>{message}</code>
        </p>
      </div>
    </div>
  );
}
