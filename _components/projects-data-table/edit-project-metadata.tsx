import Link from 'next/link'

export default function EditProjectMetadata({ project }: { project: string }) {
  return (
    <div className="text-xs flex justify-end items-center gap-2">
      <Link href={`/projects/${project}`} className="border rounded px-2 py-1">
        View
      </Link>
      <p className="border rounded px-2 py-1">Edit</p>
    </div>
  )
}
