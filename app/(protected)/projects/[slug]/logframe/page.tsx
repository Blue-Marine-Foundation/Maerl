'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
export default function LogframePage() {
  const { slug } = useParams();

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex min-h-[500px] flex-col items-center justify-center gap-4 rounded-lg bg-card p-4'>
        <p>Under reconstruction... For now, use the Theory of Change page</p>
        <Link
          href={`/projects/${slug}/theory-of-change`}
          className='inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm text-foreground/80 transition-all hover:border-foreground/50 hover:text-foreground'
        >
          Go to Theory of Change <ArrowRight className='ml-2 h-4 w-4' />
        </Link>
      </div>
    </div>
  );
}
