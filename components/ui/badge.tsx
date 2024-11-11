import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/utils/cn';

const badgeVariants = cva('inline items-center rounded px-2 py-0.5 text-sm', {
  variants: {
    variant: {
      default: 'border-transparent bg-sky-500/50 text-foreground',
      secondary: 'border-transparent bg-secondary text-secondary-foreground',
      destructive:
        'border-transparent bg-destructive text-destructive-foreground',
      outline: 'text-foreground',
      success: 'border-transparent bg-green-500/50 text-foreground',
      complete: 'border-transparent bg-green-500/50 text-foreground',
      in_progress: 'border-transparent bg-sky-500/50 text-foreground',
      delayed: 'border-transparent bg-yellow-500/50 text-foreground',
      not_started: 'border-transparent bg-gray-500/50 text-foreground',
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
