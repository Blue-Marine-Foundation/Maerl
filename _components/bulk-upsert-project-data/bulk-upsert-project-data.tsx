'use client'

import updatedData from './updated-project-data.json'
import UpsertProjectData from './server-action'
import { ProjectMetadata } from '@/_lib/types'

export default function BulkExportProjectData() {
  const goNoGo = updatedData.length

  const handleClick = async () => {
    const { data, error } = await UpsertProjectData(updatedData)

    if (error) console.log(error)

    console.log(data)
  }

  return (
    <div>
      {goNoGo > 0 && (
        <button
          type="button"
          onClick={() => handleClick()}
          className="rounded-md text-sm border px-2 py-1"
        >
          Upsert project data
        </button>
      )}
    </div>
  )
}
