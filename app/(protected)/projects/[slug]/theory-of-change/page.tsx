'use client';

import TheoryOfChange from '@/components/logframe/theory-of-change';
import { useParams } from 'next/navigation';

export default function TheoryOfChangePage() {
  const { slug } = useParams();

  return (
    <div className='flex flex-col gap-4'>
      <TheoryOfChange slug={slug as string} />
    </div>
  );
}
