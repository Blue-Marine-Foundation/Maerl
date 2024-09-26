import { ProjectMetadata } from '@/_lib/types'

export default function ProjectMetadataDialogueContent({
  entry,
}: {
  entry: ProjectMetadata
}) {
  return (
    <div className="flex flex-col gap-4 py-6">
      <div className="flex gap-4 items-baseline">
        <h3 className="text-muted-foreground flex-shrink-0 w-36">PM:</h3>
        <p className="flex-grow text-foreground">{entry.project_manager}</p>
      </div>
      <div className="flex gap-4 items-baseline">
        <h3 className="text-muted-foreground flex-shrink-0 w-36">Support:</h3>
        <p className="flex-grow text-foreground">{entry.support}</p>
      </div>
      <div className="flex gap-4 items-baseline">
        <h3 className="text-muted-foreground flex-shrink-0 w-36">
          Start date:
        </h3>
        <p className="flex-grow text-foreground">{entry.start_date}</p>
      </div>
      <div className="flex gap-4 items-baseline">
        <h3 className="text-muted-foreground flex-shrink-0 w-36">
          Project status:
        </h3>
        <p className="flex-grow text-foreground">{entry.project_status}</p>
      </div>
      <div className="flex gap-4 items-baseline">
        <h3 className="text-muted-foreground flex-shrink-0 w-36">
          Regional Strategy:
        </h3>
        <p className="flex-grow text-foreground">{entry.regional_strategy}</p>
      </div>

      <div className="flex gap-4 items-baseline">
        <h3 className="text-muted-foreground flex-shrink-0 w-36">Pillars:</h3>
        <p className="flex-grow text-foreground">{entry.pillars}</p>
      </div>
      <div className="flex gap-4 items-baseline">
        <h3 className="text-muted-foreground flex-shrink-0 w-36">
          Unit Requirements:
        </h3>
        <p className="flex-grow text-foreground">{entry.unit_requirements}</p>
      </div>
      <div className="flex gap-4 items-baseline">
        <h3 className="text-muted-foreground flex-shrink-0 w-36">
          Local contacts:
        </h3>
        <div className="text-foreground flex-grow flex flex-col gap-2">
          {entry.local_contacts &&
            entry.local_contacts.map((contact) => (
              <p key={contact.organisation}>
                {contact.organisation && <span>{contact.organisation}</span>}
                {contact.name && contact.organisation && (
                  <span className="text-foreground/80"> &mdash; </span>
                )}
                {contact.name && (
                  <span className="text-foreground/80">{contact.name}</span>
                )}
              </p>
            ))}
        </div>
      </div>
      <div className="flex gap-4 items-baseline">
        <h3 className="text-muted-foreground flex-shrink-0 w-36">
          Highlights:
        </h3>
        <p className="text-foreground flex-grow">{entry.highlights}</p>
      </div>
      <div className="flex gap-4 items-baseline">
        <h3 className="text-muted-foreground flex-shrink-0 w-36">Issues:</h3>
        <p className="text-foreground flex-grow">{entry.current_issues}</p>
      </div>
      <div className="flex gap-4 items-baseline">
        <h3 className="text-muted-foreground flex-shrink-0 w-36">
          Proposed solutions:
        </h3>
        <p className="text-foreground flex-grow">{entry.proposed_solutions}</p>
      </div>
      <div className="flex gap-4 items-baseline">
        <h3 className="text-muted-foreground flex-shrink-0 w-36">
          Board intervention req:
        </h3>
        <p className="text-foreground flex-grow">
          {entry.board_intervention_required}
        </p>
      </div>
    </div>
  )
}
