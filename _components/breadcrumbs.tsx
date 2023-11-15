'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Breadcrumbs() {
  const pathname = usePathname();
  const crumbs = pathname.split('/').filter((crumb) => crumb); // filter out empty strings

  return (
    <div className='mb-8 px-4 py-2 text-sm inline-flex justify-start items-center border border-foreground/10 rounded-lg'>
      {crumbs.map((crumb, idx) => {
        const pathToCrumb = `/${crumbs.slice(0, idx + 1).join('/')}`;
        const isLast = idx === crumbs.length - 1;

        const formattedCrumb = crumb.charAt(0).toUpperCase() + crumb.slice(1);

        return (
          <p key={crumb} className='inline-block'>
            {!isLast ? (
              <>
                <Link href={pathToCrumb} className='underline'>
                  {formattedCrumb}
                </Link>
                <span className='px-4'>&rarr;</span>
              </>
            ) : (
              formattedCrumb
            )}
          </p>
        );
      })}
    </div>
  );
}
