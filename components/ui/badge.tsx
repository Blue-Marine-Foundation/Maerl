import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/utils/cn';

const badgeVariants = cva('inline items-center rounded px-2 py-0.5 text-sm', {
  variants: {
    variant: {
      default: 'border-transparent bg-brand-twilight/10 text-brand-midnight dark:bg-brand-twilight/25 dark:text-blue-300',
      secondary: 'border-transparent bg-secondary text-secondary-foreground',
      destructive:
        'border-transparent bg-destructive text-destructive-foreground',
      outline: 'text-foreground',
      success: 'border-transparent bg-green-600/10 text-green-700 dark:text-green-400',
      complete: 'border-transparent bg-green-600/10 text-green-700 dark:text-green-400',
      in_progress: 'border-transparent bg-brand-twilight/10 text-brand-midnight dark:bg-brand-twilight/25 dark:text-blue-300',
      delayed: 'border-transparent bg-amber-500/15 text-amber-700 dark:text-amber-400',
      not_started: 'border-transparent bg-muted text-muted-foreground',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
