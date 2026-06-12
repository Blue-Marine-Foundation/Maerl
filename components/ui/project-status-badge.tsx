const STATUS_CLASSES: Record<string, string> = {
  Active: 'bg-green-600/10 text-green-700 dark:text-green-400',
  Pipeline: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  Complete: 'bg-brand-twilight/10 text-brand-midnight dark:bg-brand-twilight/25 dark:text-blue-300',
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
