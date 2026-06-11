const STATUS_CLASSES: Record<string, string> = {
  Active: 'bg-green-600/10 text-green-700',
  Pipeline: 'bg-amber-500/15 text-amber-700',
  Complete: 'bg-brand-twilight/10 text-brand-midnight',
};

export default function ProjectStatusBadge({
  status,
  size = 'sm',
}: {
  status: string;
  size?: 'xs' | 'sm';
}) {
  return (
    <span
      className={`rounded-md px-3 py-1 font-light tracking-wide ${
        size === 'xs' ? 'text-xs' : 'text-sm'
      } ${STATUS_CLASSES[status] ?? 'bg-muted text-muted-foreground'}`}
    >
      {status}
    </span>
  );
}
