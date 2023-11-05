import { getProjectList } from '@/lib/databasehelpers';
import { PRODUCTION_URL } from '@/lib/constants';
// import { Project } from '@/lib/types';
import * as Plot from '@observablehq/plot';
import * as d3 from 'd3';
import PlotFigure from '@/components/PlotFigure';
import Link from 'next/link';

export default async function Page() {
  const projects = await getProjectList();

  return (
    <div className='max-w-3xl flex flex-col justify-start items-stretch gap-4'>
      {projects.map((project) => {
        const completeProjects = project.outputs.filter(
          (output) => output.status === 'Complete'
        );
        return (
          <Link
            key={project.name}
            href={`${PRODUCTION_URL}/dashboard/project/${project.name}`}
            className='p-8 border rounded-lg flex justify-between items-center bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-slate-100'
          >
            <div>
              <h3 className='text-lg font-bold mb-2'>{project.name}</h3>
              <div className='text-sm flex justify-start items-start gap-4'>
                <p>{project.operator}</p>
                <p>
                  {`${completeProjects.length}/${project.outputs.length} outputs complete`}
                </p>
              </div>
            </div>
            <div>
              <PlotFigure
                options={{
                  height: 100,
                  width: 350,
                  style: {
                    backgound: 'blue',
                  },
                  x: {
                    domain: [new Date('2023-01-01'), new Date('2023-12-31')],
                    ticks: 0,
                  },
                  y: {
                    ticks: 0,
                  },
                  marks: [
                    Plot.line(
                      project.updates,
                      Plot.binX(
                        { y: 'sum' },
                        {
                          x: (d) => new Date(d.date),
                          y: 1,
                          interval: d3.utcMonth,
                          curve: 'catmull-rom',
                          strokeWidth: 2.5,
                        }
                      )
                    ),
                  ],
                }}
              />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
