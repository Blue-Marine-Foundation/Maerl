import Link from 'next/link';
import { ArrowRightIcon } from 'lucide-react';

type Props = {
  title: string;
  subtitle?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
};

export default function OverviewSectionHeader({
  title,
  subtitle,
  viewAllHref,
  viewAllLabel,
}: Readonly<Props>) {
  return (
    <div className='flex flex-col gap-1'>
      <div className='flex flex-wrap items-baseline justify-between gap-3'>
        <h2 className='text-lg font-semibold'>{title}</h2>
        {viewAllHref && viewAllLabel ? (
          <Link
            href={viewAllHref}
            className='flex shrink-0 items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground'
          >
            <span>{viewAllLabel}</span>
            <ArrowRightIcon className='h-4 w-4' />
          </Link>
        ) : null}
      </div>
      {subtitle ? (
        <p className='text-sm text-muted-foreground'>{subtitle}</p>
      ) : null}
    </div>
  );
}
