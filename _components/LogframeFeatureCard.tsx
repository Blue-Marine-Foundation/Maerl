import { ReactNode } from 'react';
import Link from 'next/link';

export default function LogframeFeatureCard({
  children,
  type,
  project,
  id,
  code,
  target,
  verification,
  assumption,
}: {
  children: ReactNode;
  type: string;
  project: string;
  id: number;
  code?: string;
  target?: string;
  verification?: string;
  assumption?: string;
}) {
  return (
    <div className='p-8 mb-8 bg-card-bg rounded-md'>
      <div className='flex gap-4 mb-8 text-sm font-mono'>
        <Link
          href={`/app/projects/${project}/logframe/component?type=${type}&id=${id}&code=${code}`}
          className='px-2 py-1 rounded bg-pink-300 text-card-bg'
        >
          {code}
        </Link>
        {target && (
          <p className='px-2 py-1 rounded bg-purple-300 text-card-bg'>
            {target}
          </p>
        )}
      </div>
      {children}
      {verification && (
        <div className='flex gap-4 mb-4 text-sm'>
          <div className='basis-1/5'>
            <p className='text-foreground/80'>Verified by</p>
          </div>
          <div className='basis-4/5'>
            <p>{verification}</p>
          </div>
        </div>
      )}
      {assumption && (
        <div className='flex gap-4 text-sm'>
          <div className='basis-1/5'>
            <p className='text-foreground/80'>Assumption</p>
          </div>
          <div className='basis-4/5'>
            <p>{assumption}</p>
          </div>
        </div>
      )}
    </div>
  );
}
