import { Project, Output } from '@/_lib/types';
import sortOutputs from '@/_lib/sortOutputs';
import Link from 'next/link';

export default function ProjectOutputs({ project }: { project: Project }) {
  const slug = project.slug;

  let outputs = sortOutputs(project?.outputs);

  return (
    <div className='rounded-lg overflow-hidden shadow'>
      {outputs &&
        outputs.map((output: Output) => {
          return (
            <Link
              key={output.code}
              href={`/app/projects/${slug}/logframe/output?id=${output.id}&code=${output.code}`}
              className='p-5 group flex justify-start items-center gap-12 text-sm border-b last:border-b-0 bg-card-bg transition-all hover:bg-card-bg/60'
            >
              <div className='basis-3/8'>
                <h3 className='text-base font-semibold'>
                  Output{' '}
                  {output.outputNumber && output.outputNumber > 0
                    ? output.outputNumber
                    : 'U'}
                </h3>
              </div>
              <div className='basis-4/8 grow'>
                <p className='max-w-xl'>{output.description}</p>
              </div>
              <div className='pr-4 group-hover:pr-0 transition-all'>&rarr;</div>
            </Link>
          );
        })}
    </div>
  );
}
