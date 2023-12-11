import Link from 'next/link';
import Tooltip from './Tooltip';
import { Update, FlatUpdate } from '@/_lib/types';
import dayjs from 'dayjs';

export default function Update({
  size,
  update,
}: {
  size: string;
  update: Update;
}) {
  const prefixObjectKeys = (obj: { [key: string]: any }, prefix: String) => {
    return Object.keys(obj).reduce((acc: { [key: string]: any }, key) => {
      acc[`${prefix}_${key}`] = obj[key];
      return acc;
    }, {});
  };

  const flattenUpdate = (update: Update) => {
    const prefixedProjects = update.projects
      ? prefixObjectKeys(update.projects, 'project')
      : {};

    const prefixedOutputMeasurables = update.output_measurables
      ? prefixObjectKeys(update.output_measurables, 'output')
      : {};

    const prefixedImpactIndicators = update.output_measurables
      ?.impact_indicators
      ? prefixObjectKeys(update.output_measurables.impact_indicators, 'impact')
      : {};

    const flattened = {
      ...update,
      ...prefixedProjects,
      ...prefixedOutputMeasurables,
      ...prefixedImpactIndicators,
    };

    // Remove the nested structures since their properties are now in the flat object
    delete flattened.projects;
    delete flattened.output_measurables;

    //@ts-ignore
    delete flattened.output_impact_indicators;

    return flattened;
  };

  const flatUpdate = flattenUpdate(update) as FlatUpdate;

  const relativeTime = require('dayjs/plugin/relativeTime');
  dayjs.extend(relativeTime);

  // @ts-ignore
  const date = dayjs().to(dayjs(flatUpdate.date));

  return (
    <div className='flex justify-start text-white mb-4 p-6 bg-card-bg rounded-md shadow '>
      {flatUpdate.project_name && size != 'small' && (
        <div className='w-20'>
          <Link
            style={{ background: flatUpdate.project_highlight_color }}
            href={`/app/projects/${flatUpdate.project_name}`}
            className='py-1 px-2 text-xs text-background rounded-md'
          >
            {flatUpdate.project_name}
          </Link>
        </div>
      )}

      <div>
        <div className='text-xs text-foreground/80 font-mono flex justify-start items-center gap-8 mb-4 pt-1.5'>
          <Tooltip tooltipContent={flatUpdate.date}>{date}</Tooltip>
          <Tooltip
            tooltipContent={flatUpdate.output_description}
            tooltipWidth={380}
          >
            Output {flatUpdate.output_code}
          </Tooltip>

          {flatUpdate.impact_indicator_code &&
          flatUpdate.impact_indicator_title ? (
            <Tooltip
              tooltipContent={flatUpdate.impact_indicator_title}
              tooltipWidth={380}
            >
              Impact indicator {flatUpdate.impact_indicator_code}
            </Tooltip>
          ) : (
            <p className=''>Progress</p>
          )}
        </div>

        <p className='text-sm leading-7 max-w-md'>{flatUpdate.description}</p>
      </div>

      {size === 'large' && (
        <div className='ml-auto pl-8 flex justify-start items-center gap-12'>
          {flatUpdate.value && (
            <div className='p-4 w-40 text-center text-foreground border rounded-lg'>
              <p className='text-2xl mb-2'>{flatUpdate.value}</p>
              <p className='text-sm'>{flatUpdate.output_unit}</p>
            </div>
          )}
          <div className='w-40'>
            {flatUpdate.link && (
              <Link
                href={`/app/projects/${flatUpdate.project_name}`}
                className='py-1 px-2 text-sm text-foreground/80 hover:text-foreground'
                target='_blank'
              >
                <span className='underline'>View verification</span> &rarr;
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
