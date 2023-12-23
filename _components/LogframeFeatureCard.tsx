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
    <Link
      href={`/app/projects/${project}/logframe/${
        code?.startsWith('OC.') ? 'outcome' : 'output'
      }?id=${id}&code=${code}`}
      className='block pt-4 px-4 pb-5 max-w-4xl bg-card-bg hover:bg-card-bg/60 border-b first-of-type:rounded-t-lg first-of-type:pt-5 last-of-type:rounded-b-lg last-of-type:pb-5 last-of-type:border-b-transparent'
    >
      <div className='flex justify-start items-baseline gap-8 text-sm'>
        <span className='px-2 py-1 text-sm font-mono rounded bg-pink-300 text-card-bg'>
          {code}
        </span>

        <div className='flex flex-col gap-4 max-w-2xl'>
          {children}
          {/* {verification && (
            <p className='text-foreground/75'>Verified by: {verification}</p>
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
          )} */}
        </div>
      </div>
    </Link>
  );
}
