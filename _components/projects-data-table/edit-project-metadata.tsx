export default function EditProjectMetadata({ project }: { project: string }) {
  return (
    <div className="text-xs flex justify-end">
      <p className="border rounded px-2 py-1">
        Edit <span className="font-mono">{project}</span>
      </p>
    </div>
  )
}
