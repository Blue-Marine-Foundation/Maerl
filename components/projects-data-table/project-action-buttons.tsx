'use client';

import Link from 'next/link';
import { ProjectMetadata } from '@/utils/types';

export default function ProjectActionButtons({
  project,
}: {
  project: ProjectMetadata;
}) {
  return (
    <div className='flex items-center justify-end gap-2 text-xs'>
      <Link
        href={`/projects/${project.slug}`}
        className='rounded border px-2 py-1'
      >
        View
      </Link>
      <button type='button' className='rounded border px-2 py-1'>
        Edit
      </button>
    </div>
  );
}
