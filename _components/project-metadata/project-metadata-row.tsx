'use client';

import { useRef, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ProjectMetadata } from '@/_lib/types';
import ProjectMetadataDialogueContent from './project-metadata-dialogue-content';
import EditableProjectMetadataForm from './project-metadata-editing-form';

export default function ProjectMetaDataRow({
  entry,
}: {
  entry: ProjectMetadata;
}) {
  const [entryData, setEntryData] = useState<ProjectMetadata>(entry);

  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const updateEntryData = async (updatedData: ProjectMetadata) => {
    setEntryData(updatedData);
    setIsEditing(false);
  };

  return (
    <>
      <tr
        key={entry.name}
        className='even:bg-white/10 cursor-pointer'
        onClick={() => setIsOpen(true)}
      >
        <td className='pl-2 pr-1 py-3 align-baseline '>{entryData.id}</td>
        <td className='pl-2 pr-1 py-3 align-baseline'>
          {entryData.name.length < 16
            ? entryData.name
            : entryData.name.slice(0, 15) + '...'}
        </td>
        <td className='pl-2 pr-1 py-3 align-baseline'>
          {entryData.regional_strategy}
        </td>
        <td className='px-1 py-3 align-baseline'>{entryData.start_date}</td>
        <td className='px-1 py-3 align-baseline'>{entryData.pillars}</td>
        <td className='px-1 py-3 align-baseline'>
          {entryData.unit_requirements}
        </td>
        <td className='px-1 py-3 align-baseline'>
          <div className='flex flex-col gap-1'>
            {entryData.users && (
              <p key={entryData.users.first_name + entryData.users.last_name}>
                {entryData.users.first_name} {entryData.users.last_name}
              </p>
            )}
            {entryData.project_contacts &&
              entryData.project_contacts.map((contact) => {
                return (
                  <div key={contact.name} className='flex flex-col gap-1'>
                    <p>{contact.name}</p>
                  </div>
                );
              })}
          </div>
        </td>
        <td className='px-1 py-3 align-baseline'>
          <div className='flex flex-col gap-1'>
            {entryData.funding_status && <p>{entryData.funding_status}</p>}
          </div>
        </td>
        <td className='px-1 py-3 align-baseline'>
          <div className='flex flex-col gap-1'>
            {entryData.funders &&
              entryData.funders.map((funder) => (
                <p key={funder.name}>{funder.name}</p>
              ))}
          </div>
        </td>

        <td className='px-1 py-3 align-baseline'>
          <div className='flex flex-col gap-1'>
            {entryData.local_partners &&
              entryData.local_partners.map((partner) => {
                return (
                  <p key={partner.name}>
                    {partner.organisation ? partner.organisation : partner.name}
                  </p>
                );
              })}
          </div>
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
                  <div className='flex justify-end items-center gap-4'>
                    {isEditing && (
                      <button
                        type='button'
                        role='button'
                        className='text-sm px-2 py-1 border rounded shadow'
                        onClick={() => {
                          if (formRef.current) {
                            formRef.current.dispatchEvent(
                              new Event('submit', {
                                cancelable: true,
                                bubbles: true,
                              })
                            );
                          }
                        }}
                      >
                        Save
                      </button>
                    )}
                    <button
                      role='button'
                      className='text-sm px-2 py-1 border rounded shadow'
                      onClick={() => {
                        setIsEditing(!isEditing);
                      }}
                    >
                      {isEditing ? 'Cancel' : 'Edit'}
                    </button>
                    <button
                      role='button'
                      className='text-sm px-2 py-1 border rounded shadow'
                      onClick={() => {
                        setIsOpen(false);
                      }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </DialogTitle>
              <DialogDescription>
                {isEditing ? (
                  <EditableProjectMetadataForm
                    entry={entryData}
                    ref={formRef}
                    onSubmitSuccess={updateEntryData}
                  />
                ) : (
                  <ProjectMetadataDialogueContent entry={entryData} />
                )}
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
