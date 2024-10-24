export default function ProjectStatusBadge({
  status,
  size = 'sm',
}: {
  status: string;
  size?: 'xs' | 'sm';
}) {
  return (
    <span
      className={`rounded-md px-3 py-1 text-sm font-light tracking-wide ${
        size === 'xs' ? 'text-xs' : 'text-sm'
      } ${status === 'Active' && 'bg-green-500/15 text-green-500'} ${
        status === 'Pipeline' && 'bg-yellow-500/15 text-yellow-400'
      } ${status === 'Complete' && 'bg-blue-500/15 text-blue-400'} }`}
    >
      {status}
    </span>
  );
}
