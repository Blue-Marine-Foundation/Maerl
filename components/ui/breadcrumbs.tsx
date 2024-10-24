'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbsProps {
  projectName?: string;
}

export default function Breadcrumbs({ projectName }: BreadcrumbsProps) {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter((segment) => segment);

  const breadcrumbs = [
    { name: 'Home', path: '/' },
    ...pathSegments.map((segment, index) => {
      let name = segment;
      if (segment === 'projects') name = 'Projects';
      else if (index === 1 && projectName) name = projectName;
      else name = segment.charAt(0).toUpperCase() + segment.slice(1);

      return {
        name,
        path: `/${pathSegments.slice(0, index + 1).join('/')}`,
      };
    }),
  ];

  return (
    <nav aria-label='Breadcrumb'>
      <ol className='flex flex-wrap items-center gap-2 text-sm text-muted-foreground'>
        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.path} className='flex items-center'>
            {index > 0 && (
              <ChevronRight className='mr-2 h-4 w-4 text-muted-foreground/60' />
            )}
            {index === breadcrumbs.length - 1 ? (
              <span className='max-w-48 truncate font-medium text-foreground'>
                {crumb.name}
              </span>
            ) : (
              <Link
                href={crumb.path}
                className='max-w-28 truncate transition-colors duration-200 hover:text-foreground'
              >
                {crumb.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
