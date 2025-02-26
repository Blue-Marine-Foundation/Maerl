import { cn } from '@/utils/cn';

export type InfoTipVariant = 'info' | 'warning' | 'success';

const variantStyles: Record<InfoTipVariant, string> = {
  info: 'border-blue-600 bg-blue-500/10 text-blue-300',
  success: 'border-green-800 bg-green-500/10 text-green-400',
  warning: 'border-yellow-800 bg-yellow-500/10 text-yellow-400',
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
