'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { extractDateParams } from '@/utils/date-utils';

interface BreadcrumbsProps {
  projectName?: string;
  type?: 'impactindicator' | 'project';
}

export default function Breadcrumbs({ projectName, type }: BreadcrumbsProps) {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter((segment) => segment);
  const searchParams = useSearchParams();
  const dateParams = extractDateParams(searchParams);
  const hasDateParams = dateParams.toString().length > 0;
  const breadcrumbs = [
    { name: 'Home', path: '/' },
    ...pathSegments.map((segment, index) => {
      let name = segment;
      if (segment === 'projects') name = 'Projects';
      else if (index === 1 && projectName) name = projectName;
      else if (type === 'impactindicator' && index === 0)
        name = 'Impact Indicators';
      else {
        // Handle hyphenated segments by splitting, capitalizing each word, and joining
        name = segment
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      }

      return {
        name,
        path: `/${pathSegments.slice(0, index + 1).join('/')}${
          hasDateParams ? `?${dateParams.toString()}` : ''
        }`,
      };
    }),
  ];

  return (
    <nav aria-label='Breadcrumb'>
      <ol className='flex flex-wrap items-center gap-2 text-xs text-muted-foreground'>
        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.path} className='flex items-center'>
            {index > 0 && (
              <ChevronRight className='mr-2 h-4 w-4 text-muted-foreground/60' />
            )}
            {index === breadcrumbs.length - 1 ? (
              <span className='max-w-48 truncate font-medium text-foreground/90'>
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
