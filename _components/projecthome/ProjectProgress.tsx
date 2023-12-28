import { Project, Measurable } from '@/_lib/types';
import Tooltip from '../Tooltip';

export default function ProjectProgess({ project }: { project: Project }) {
  return (
    <div>
      <p className='mb-4 font-medium'>Output Progress</p>
      <div className='self-start p-6 text-slate-400 bg-card-bg rounded-md shadow'>
        {project.output_measurables &&
          project.output_measurables
            .sort((a: Measurable, b: Measurable) =>
              a.code.localeCompare(b.code)
            )
            .map((c: Measurable) => {
              return (
                <div
                  key={c.code}
                  className='flex justify-start items-center gap-2 text-sm font-mono mb-4 last:mb-0'
                >
                  <div className='basis-2/8 pr-2 text-foreground'>
                    <Tooltip
                      tooltipContent={c.description}
                      tooltipWidth={380}
                      tooltipDirection='left'
                    >
                      {c.code}
                    </Tooltip>
                  </div>
                  <div className='w-full rounded-lg bg-gray-900 overflow-hidden'>
                    <div
                      style={{ width: `${c.percentage_complete * 100}%` }}
                      className='p-1 rounded-lg bg-green-400'
                    ></div>
                  </div>
                  <p className='w-[60px] text-right'>
                    {(c.percentage_complete * 100).toFixed(0)}%
                  </p>
                </div>
              );
            })}
      </div>
    </div>
  );
}
