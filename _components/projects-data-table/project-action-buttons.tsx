'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { ProjectMetadata } from '@/_lib/types'
import ProjectMetadataDialogueContent from '@/_components/project-metadata-dialogue/project-metadata-dialogue-content'
import EditableProjectMetadataForm from '@/_components/project-metadata-dialogue/project-metadata-editing-form'

export default function ProjectActionButtons({
  project,
}: {
  project: ProjectMetadata
}) {
  const [entryData, setEntryData] = useState<ProjectMetadata>(project)
  const [isOpen, setIsOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(true)
  const formRef = useRef<HTMLFormElement>(null)

  const updateEntryData = async (updatedData: ProjectMetadata) => {
    setEntryData(updatedData)
    setIsEditing(false)
  }

  return (
    <div className="text-xs flex justify-end items-center gap-2">
      <Link
        href={`/projects/${project.slug}`}
        className="border rounded px-2 py-1"
      >
        View
      </Link>
      <button
        type="button"
        className="border rounded px-2 py-1"
        onClick={() => setIsOpen(true)}
      >
        Edit
      </button>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <div className="sr-only">
              <DialogTitle>Project metadata editing view</DialogTitle>
            </div>
            <div className="flex justify-between items-center gap-4">
              <div className="flex justify-start items-center gap-4">
                <h2 className="text-lg font-semibold">{entryData.name}</h2>
              </div>
              <div className="flex justify-end items-center gap-4">
                {isEditing && (
                  <button
                    type="button"
                    role="button"
                    className="text-sm px-2 py-1 border rounded shadow"
                    onClick={() => {
                      if (formRef.current) {
                        formRef.current.dispatchEvent(
                          new Event('submit', {
                            cancelable: true,
                            bubbles: true,
                          })
                        )
                      }
                    }}
                  >
                    Save
                  </button>
                )}
                <button
                  role="button"
                  className="text-sm px-2 py-1 border rounded shadow"
                  onClick={() => {
                    setIsEditing(!isEditing)
                  }}
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
                <button
                  role="button"
                  className="text-sm px-2 py-1 border rounded shadow"
                  onClick={() => {
                    setIsOpen(false)
                  }}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="text-sm">
              {isEditing ? (
                <EditableProjectMetadataForm
                  entry={entryData}
                  ref={formRef}
                  onSubmitSuccess={updateEntryData}
                />
              ) : (
                <ProjectMetadataDialogueContent entry={entryData} />
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
