import { Project, Output } from '@/_lib/types';
import Link from 'next/link';

export default function ProjectOutputs({ project }: { project: Project }) {
  const slug = project.slug;

  return (
    <div>
      {/* <h2 className='mb-4 font-medium'>Outputs</h2> */}
      <div className='rounded-lg overflow-hidden shadow'>
        {project.outputs &&
          project.outputs
            .sort((a: Output, b: Output) => a.id - b.id)
            .map((c: Output) => {
              return (
                <Link
                  key={c.code}
                  href={`/app/projects/${slug}/logframe#output${c.code.replace(
                    '.',
                    ''
                  )}`}
                  className='p-5 group flex justify-start items-baseline gap-12 text-sm border-b last:border-b-0 bg-card-bg transition-all hover:bg-card-bg/60'
                >
                  <div className='basis-3/8'>Output {c.code}</div>
                  <div className='basis-4/8 grow'>
                    <p className='max-w-xl'>{c.description}</p>
                  </div>
                  <div className='pr-4 group-hover:pr-0 transition-all'>
                    &rarr;
                  </div>
                </Link>
              );
            })}
      </div>
    </div>
  );
}
