import { ProjectMetadata } from '@/_lib/types';

export default function ProjectMetadataDialogueContent({
  entry,
}: {
  entry: ProjectMetadata;
}) {
  return (
    <div className='flex flex-col gap-4 py-6'>
      <div className='flex gap-4 items-baseline'>
        <h3 className='flex-shrink-0 w-40'>Regional Strategy:</h3>
        <p className='flex-grow text-foreground'>{entry.regional_strategy}</p>
      </div>
      <div className='flex gap-4 items-baseline'>
        <h3 className='flex-shrink-0 w-40'>Start Date:</h3>
        <p className='flex-grow text-foreground'>{entry.start_date}</p>
      </div>
      <div className='flex gap-4 items-baseline'>
        <h3 className='flex-shrink-0 w-40'>Pillars:</h3>
        <p className='flex-grow text-foreground'>{entry.pillars}</p>
      </div>
      <div className='flex gap-4 items-baseline'>
        <h3 className='flex-shrink-0 w-40'>Unit Requirements:</h3>
        <p className='flex-grow text-foreground'>{entry.unit_requirements}</p>
      </div>
      <div className='flex gap-4 items-baseline'>
        <h3 className='flex-shrink-0 w-40'>Project Contacts:</h3>
        <div className='text-foreground flex-grow flex flex-col gap-2'>
          {entry.users && (
            <div
              key={entry.users.first_name + entry.users.last_name}
              className='flex flex-col gap-1'
            >
              <p>
                {entry.users.first_name} {entry.users.last_name}
              </p>
            </div>
          )}
          {entry.project_contacts &&
            entry.project_contacts.map((contact) => {
              return (
                <div key={contact.name}>
                  <p>{contact.name}</p>
                  {contact.organisation && (
                    <p className='text-foreground/70'>{contact.organisation}</p>
                  )}
                </div>
              );
            })}
        </div>
      </div>
      <div className='flex gap-4 items-baseline'>
        <h3 className='flex-shrink-0 w-40'>Funding Status:</h3>

        <p className='text-foreground flex-grow'>
          {entry.funding_status && entry.funding_status}
        </p>
      </div>
      <div className='flex gap-4 items-baseline'>
        <h3 className='flex-shrink-0 w-40'>Current Funders:</h3>
        <div className='text-foreground flex-grow flex flex-col gap-2'>
          {entry.funders &&
            entry.funders.map((funder) => (
              <p key={funder.name}>{funder.name}</p>
            ))}
        </div>
      </div>
      <div className='flex gap-4 items-baseline'>
        <h3 className='flex-shrink-0 w-40'>Local Partners:</h3>
        {entry.local_partners &&
          entry.local_partners.map((contact) => (
            <div
              key={contact.name}
              className='text-foreground flex-grow flex flex-col gap-2'
            >
              <p>
                {contact.name}{' '}
                {contact.organisation && (
                  <span className='text-foreground/80'>
                    &mdash; {contact.organisation}
                  </span>
                )}
              </p>
            </div>
          ))}
      </div>
      <div className='flex gap-4 items-baseline'>
        <h3 className='flex-shrink-0 w-40'>Issues:</h3>
        <p className='text-foreground flex-grow'>{entry.project_issues}</p>
      </div>
      <div className='flex gap-4 items-baseline'>
        <h3 className='flex-shrink-0 w-40'>Exit Strategy:</h3>
        <p className='text-foreground flex-grow'>{entry.exit_strategy}</p>
      </div>
      <div className='flex gap-4 items-baseline'>
        <h3 className='flex-shrink-0 w-40'>Impact:</h3>
        <div className='text-foreground flex-grow'>
          {entry.stub ? (
            <p>Project has no logframe yet</p>
          ) : (
            entry.impacts &&
            entry.impacts.map((impact) => <p key={impact.id}>{impact.title}</p>)
          )}
        </div>
      </div>
      <div className='flex gap-4 items-baseline'>
        <h3 className='flex-shrink-0 w-40'>Outcomes:</h3>
        <div className='text-foreground flex-grow'>
          {entry.stub ? (
            <p>Project has no logframe yet</p>
          ) : (
            entry.outcomes &&
            entry.outcomes.map((outcome) => (
              <p key={outcome.id}>
                <span className='font-medium'>{outcome.code}</span>{' '}
                {outcome.description}
              </p>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
