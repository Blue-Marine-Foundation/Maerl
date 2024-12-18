import FeatureCard from '../ui/feature-card';

export default function TheoryOfChangeSkeleton() {
  return (
    <div className='grid grid-cols-[30%_1fr] items-start gap-8 text-sm'>
      <FeatureCard title='Impact'>
        <div className='flex grow flex-col items-center justify-center'>
          <p className='rounded-md bg-muted-foreground/10 px-2 py-1 text-center text-muted-foreground'>
            Loading impact
          </p>
        </div>
      </FeatureCard>
      <div className='flex flex-col gap-4'>
        <FeatureCard title='Outcome'>
          <div className='flex grow flex-col items-center justify-center'>
            <p className='rounded-md bg-muted-foreground/10 px-2 py-1 text-center text-muted-foreground'>
              Loading outcome
            </p>
          </div>
        </FeatureCard>
        <FeatureCard title='Outcome'>
          <div className='flex grow flex-col items-center justify-center'>
            <p className='rounded-md bg-muted-foreground/10 px-2 py-1 text-center text-muted-foreground'>
              Loading outcome
            </p>
          </div>
        </FeatureCard>
        <FeatureCard title='Outcome'>
          <div className='flex grow flex-col items-center justify-center'>
            <p className='rounded-md bg-muted-foreground/10 px-2 py-1 text-center text-muted-foreground'>
              Loading outcome
            </p>
          </div>
        </FeatureCard>
      </div>
    </div>
  );
}
