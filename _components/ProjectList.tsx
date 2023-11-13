import { createClient } from '@/_utils/supabase/server';
import { PRODUCTION_URL } from '@/lib/constants';
import { Project, Update, Output } from '@/lib/types';
import * as Plot from '@observablehq/plot';
import * as d3 from 'd3';
import PlotFigure from '@/components/PlotFigure';
import Link from 'next/link';

export default async function Page() {
  const supabase = createClient();

  const { data: projects, error } = await supabase
    .from('projects')
    .select('*, outputs (*), updates (*)');

  if (error) {
    throw new Error(`Failed to fetch projects: ${error.message}`);
  }

  return (
    <div className='max-w-3xl flex flex-col justify-start items-stretch gap-4'>
      {projects.map((project: Project) => {
        const completeProjects =
          project.outputs?.filter(
            (output: Output) => output.status === 'Complete'
          ) || [];
        const numberCompleteProjects = completeProjects.length;
        return (
          <Link
            key={project.name}
            href={`${PRODUCTION_URL}/dashboard/projects/${project.name}`}
            className='p-8 border rounded-lg flex justify-between items-center bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-slate-100'
          >
            <div>
              <h3 className='text-lg font-bold mb-2'>{project.name}</h3>
              <div className='text-sm flex justify-start items-start gap-4'>
                <p>{project.operator}</p>
                <p>
                  {`${completeProjects.length}/${
                    project.outputs ? project.outputs.length : 'N/A'
                  } outputs complete`}
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
                    label: 'No. Updates',
                    labelArrow: 'up',
                  },
                  marks: [
                    Plot.line(
                      project.updates,
                      Plot.binX(
                        { y: 'sum' },
                        {
                          x: (d) => new Date(d.date),
                          interval: d3.utcMonth,
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
