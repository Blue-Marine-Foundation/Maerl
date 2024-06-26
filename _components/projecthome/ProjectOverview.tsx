import { Project, User } from '@/_lib/types';

export default function ProjectOverview({
  project,
  pm,
}: {
  project: Project;
  pm: User;
}) {
  return (
    <>
      <h2 className='font-medium'>Overview</h2>

      <div className='lg:pt-5 grid grid-cols-1 gap-6 text-sm text-slate-400 '>
        <div>
          <p className='mb-2'>Project Manager</p>
          <p className='text-white'>
            {pm ? `${pm.first_name} ${pm.last_name}` : 'TBC'}
          </p>
        </div>

        <div>
          <p className='mb-2'>Lead Partner</p>
          <p className='text-white'>
            {project.lead_partner ? project.lead_partner : 'TBC'}
          </p>
        </div>

        {project.start_date && (
          <div>
            <p className='mb-2'>Start date</p>
            <p className='text-white'>{project.start_date}</p>
          </div>
        )}

        {project.delivery_partners && (
          <div>
            <p className='mb-2'>Delivery Partners</p>
            <ul className='text-white'>
              {project.delivery_partners.map((partner: { name: String }) => (
                <li className='mb-2 last:mb-0'>{partner.name}</li>
              ))}
            </ul>
          </div>
        )}
        {project.funding_partner && (
          <div>
            <p className='mb-2'>Funding Partner</p>
            <p className='text-white'>{project.funding_partner}</p>
          </div>
        )}
        {project.funders && (
          <div>
            <p className='mb-2'>Funders</p>
            <ul className='text-white'>
              {project.funders.map((funder: { name: String }) => (
                <li className='mb-2 last:mb-0'>{funder.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
