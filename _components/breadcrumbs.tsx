'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Breadcrumbs() {
  const pathname = usePathname();
  const crumbs = pathname.split('/').filter((crumb) => crumb); // filter out empty strings

  return (
    <p>
      {crumbs.map((crumb, idx) => {
        const pathToCrumb = `/${crumbs.slice(0, idx + 1).join('/')}`;
        const isLast = idx === crumbs.length - 1;

        const formattedCrumb = crumb.charAt(0).toUpperCase() + crumb.slice(1);

        return (
          <span key={crumb}>
            {!isLast ? (
              <>
                <Link href={pathToCrumb}>{formattedCrumb}</Link>
                <span> / </span>
              </>
            ) : (
              formattedCrumb
            )}
          </span>
        );
      })}
    </p>
  );
}
