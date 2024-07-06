'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  // DialogTrigger,
} from '@/components/ui/dialog';
import { ProjectMetadata } from '@/_lib/types';
import ProjectMetadataDialogueContent from './project-metadata-dialogue-content';
import EditableProjectMetadataForm from './project-metadata-editing-form';

export default function ProjectMetaDataRow({
  entry,
}: {
  entry: ProjectMetadata;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <tr
        key={entry.name}
        className='even:bg-white/10 cursor-pointer'
        onClick={() => setIsOpen(true)}
      >
        <td className='pl-2 pr-1 py-3 align-baseline '>{entry.id}</td>
        <td className='pl-2 pr-1 py-3 align-baseline'>{entry.name}</td>
        <td className='pl-2 pr-1 py-3 align-baseline'>
          {entry.regional_strategy}
        </td>
        <td className='px-1 py-3 align-baseline'>{entry.start_date}</td>
        <td className='px-1 py-3 align-baseline'>{entry.pillars}</td>
        <td className='px-1 py-3 align-baseline'>{entry.unit_requirements}</td>
        <td className='px-1 py-3 align-baseline'>
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
                <div key={contact.name} className='flex flex-col gap-1'>
                  <p>{contact.name}</p>
                  {contact.organisation && (
                    <p className='text-foreground/80'>{contact.organisation}</p>
                  )}
                </div>
              );
            })}
        </td>
        <td className='px-1 py-3 align-baseline'>
          <div className='flex flex-col gap-1'>
            {entry.funding_status && <p>{entry.funding_status}</p>}
          </div>
        </td>
        <td className='px-1 py-3 align-baseline'>
          <div className='flex flex-col gap-1'>
            {entry.funders &&
              entry.funders.map((funder) => (
                <p key={funder.name}>{funder.name}</p>
              ))}
          </div>
        </td>

        <td className='px-1 py-3 align-baseline'>
          {entry.local_partners &&
            entry.local_partners.map((partner) => {
              return (
                <div key={partner.name} className='flex flex-col gap-1'>
                  <p>{partner.name}</p>
                  {partner.organisation && (
                    <p className='text-foreground/80'>{partner.organisation}</p>
                  )}
                </div>
              );
            })}
        </td>
      </tr>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                <div className='flex justify-between items-center gap-4'>
                  <div className='flex justify-start items-center gap-4'>
                    <span
                      style={{ background: entry.highlight_color }}
                      className='flex justify-center items-center w-10 h-10 font-semibold text-background rounded-md'
                    >
                      {entry.id}
                    </span>
                    <h2>{entry.name}</h2>
                  </div>
                  <button
                    role='button'
                    onClick={() => {
                      console.log(isEditing);
                      setIsEditing(!isEditing);
                    }}
                  >
                    Edit
                  </button>
                </div>
              </DialogTitle>
              <DialogDescription>
                {isEditing ? (
                  <EditableProjectMetadataForm entry={entry} />
                ) : (
                  <ProjectMetadataDialogueContent entry={entry} />
                )}
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
