import { Project, User } from '@/_lib/types';

export default function ProjectOverview({
  project,
  pm,
}: {
  project: Project;
  pm: User;
}) {
  return (
    <div>
      <p className='mb-4 font-medium'>Project Overview</p>
      <div className='p-5 flex flex-col gap-6 text-sm text-slate-400 bg-card-bg rounded-md shadow'>
        <div>
          <p className='mb-2'>Lead Partner</p>
          <p className='text-white'>{project.lead_partner}</p>
        </div>
        <div>
          <p className='mb-2'>Start date</p>
          <p className='text-white'>{project.start_date}</p>
        </div>
        <div>
          <p className='mb-2'>Project Manager</p>
          <p className='text-white'>{`${pm.first_name} ${pm.last_name}`}</p>
        </div>
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
            <p className='mb-2'>Funding Partners</p>
            <ul className='text-white'>
              {project.funding_partner.map((partner: { name: String }) => (
                <li className='mb-2 last:mb-0'>{partner.name}</li>
              ))}
            </ul>
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
    </div>
  );
}
