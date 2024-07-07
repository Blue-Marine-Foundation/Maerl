import { ProjectMetadata } from '@/_lib/types';

export default function ProjectMetadataDialogueContent({
  entry,
}: {
  entry: ProjectMetadata;
}) {
  return (
    <div className='flex flex-col gap-4 py-6'>
      <div className='flex gap-4 items-baseline'>
        <h3 className='flex-shrink-0 w-36'>Regional Strategy:</h3>
        <p className='flex-grow text-foreground'>{entry.regional_strategy}</p>
      </div>
      <div className='flex gap-4 items-baseline'>
        <h3 className='flex-shrink-0 w-36'>Start Date:</h3>
        <p className='flex-grow text-foreground'>{entry.start_date}</p>
      </div>
      <div className='flex gap-4 items-baseline'>
        <h3 className='flex-shrink-0 w-36'>Pillars:</h3>
        <p className='flex-grow text-foreground'>{entry.pillars}</p>
      </div>
      <div className='flex gap-4 items-baseline'>
        <h3 className='flex-shrink-0 w-36'>Unit Requirements:</h3>
        <p className='flex-grow text-foreground'>{entry.unit_requirements}</p>
      </div>
      <div className='flex gap-4 items-baseline'>
        <h3 className='flex-shrink-0 w-36'>Project Contacts:</h3>
        <div className='text-foreground flex-grow flex flex-col gap-2'>
          {entry.users && (
            <div
              key={`${entry.id}-${entry.users.id}`}
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
        <h3 className='flex-shrink-0 w-36'>Funding Status:</h3>

        <p className='text-foreground flex-grow'>
          {entry.funding_status && entry.funding_status}
        </p>
      </div>
      <div className='flex gap-4 items-baseline'>
        <h3 className='flex-shrink-0 w-36'>Current Funders:</h3>
        <p className='text-foreground flex-grow'>
          {entry.funders &&
            entry.funders.map((funder, index) => (
              <span key={funder.name}>
                {funder.name}
                {index !== entry.funders!.length - 1 && <span>, </span>}
              </span>
            ))}
        </p>
      </div>
      <div className='flex gap-4 items-baseline'>
        <h3 className='flex-shrink-0 w-36'>Local Partners:</h3>
        <div className='text-foreground flex-grow flex flex-col gap-2'>
          {entry.local_partners &&
            entry.local_partners.map((contact) => (
              <p key={contact.organisation}>
                {contact.organisation && <span>{contact.organisation}</span>}
                {contact.name && contact.organisation && (
                  <span className='text-foreground/80'> &mdash; </span>
                )}
                {contact.name && (
                  <span className='text-foreground/80'>{contact.name}</span>
                )}
              </p>
            ))}
        </div>
      </div>
      <div className='flex gap-4 items-baseline'>
        <h3 className='flex-shrink-0 w-36'>Issues:</h3>
        <p className='text-foreground flex-grow'>{entry.project_issues}</p>
      </div>
      <div className='flex gap-4 items-baseline'>
        <h3 className='flex-shrink-0 w-36'>Exit Strategy:</h3>
        <p className='text-foreground flex-grow'>{entry.exit_strategy}</p>
      </div>
      <div className='flex gap-4 items-baseline'>
        <h3 className='flex-shrink-0 w-36'>Impact:</h3>
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
        <h3 className='flex-shrink-0 w-36'>Outcomes:</h3>
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
