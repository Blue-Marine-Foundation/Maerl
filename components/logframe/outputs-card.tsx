'use client';

import { Output } from '@/utils/types';
import { Badge, BadgeProps } from '@/components/ui/badge';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function OutputCard({ output }: { output: Output }) {
  const { slug } = useParams();

  return (
    <div className='grid grid-cols-[50px_96px_1fr_50px] items-baseline justify-between gap-4 text-sm'>
      <div>
        <Badge className='mr-2'>{output.code}</Badge>
      </div>
      <div>
        <Badge
          variant={
            output.status
              ? (output.status
                  .toLowerCase()
                  .replace(' ', '_') as BadgeProps['variant'])
              : 'default'
          }
        >
          {output.status}
        </Badge>
      </div>

      <div className=''>
        <Link
          href={`/projects/${slug}/logframe/output?id=${output.id}`}
          className='hover:underline'
        >
          <p>{output.description}</p>
        </Link>
      </div>
    </div>
  );
}
