import ImpactForm from '@/components/logframe/impact-form';
import OutcomesForm from '@/components/logframe/outcomes-form';

export default function Logframe() {
  return (
    <div className='flex flex-col gap-4 rounded-lg border border-dashed p-4'>
      <h3 className='mb-auto text-sm font-semibold text-muted-foreground'>
        Logframe
      </h3>
      <div className='grid grid-cols-[30%_1fr] items-start gap-8 text-sm'>
        <ImpactForm />
        <div className='flex flex-col gap-4'>
          <OutcomesForm />
          <OutcomesForm />
          <OutcomesForm />
        </div>
      </div>
    </div>
  );
}
