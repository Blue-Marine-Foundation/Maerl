import { ReactNode } from 'react';

export default function LogframeSection({
  slug,
  title,
  children,
}: {
  slug?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className='mb-10 flex justify-start items-start gap-8'>
      <div className='basis-1/6'>
        <h3 className='text-xl font-medium text-foreground/80'>{title}</h3>
      </div>

      <div className='basis-5/6'>{children}</div>
    </div>
  );
}
