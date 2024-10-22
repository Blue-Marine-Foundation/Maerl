'use client';

import OutputForm from './output-form';

export default function OutcomeForm() {
  return (
    <div className='flex flex-col gap-4'>
      <p className='rounded-lg bg-card p-4 font-semibold'>Outcome</p>
      <div className='flex flex-col gap-4 pl-12'>
        <OutputForm />
        <OutputForm />
      </div>
    </div>
  );
}
