import { cn } from '@/utils/cn';

export type InfoTipVariant = 'info' | 'warning' | 'success';

const variantStyles: Record<InfoTipVariant, string> = {
  info: 'border-brand-twilight/30 bg-brand-seafoam text-brand-marine',
  success: 'border-green-600/30 bg-green-600/10 text-green-800 dark:text-green-300',
  warning: 'border-amber-500/40 bg-amber-500/10 text-amber-800 dark:text-amber-300',
};

type CalloutCardProps = {
  variant: InfoTipVariant;
  label: string;
  content: string;
};

export default function CalloutCard({
  variant,
  label,
  content,
}: CalloutCardProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-[1fr_4fr] rounded border px-4 py-2',
        variantStyles[variant],
      )}
    >
      <p>{label}:</p>
      <p>{content}</p>
    </div>
  );
}
