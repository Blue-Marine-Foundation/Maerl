import { Pencil, PlusCircle } from 'lucide-react';
import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface EditButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'edit' | 'add';
  label?: string;
}

export default function EditButton({
  variant = 'edit',
  label,
  className,
  ...props
}: EditButtonProps) {
  return (
    <button
      className={cn(
        'flex items-center gap-2 rounded-md border px-3 py-1 text-sm transition-colors hover:bg-accent',
        className,
      )}
      {...props}
    >
      {variant === 'edit' ? (
        <>
          <Pencil className='h-3 w-3' />
          {label || 'Edit'}
        </>
      ) : (
        <>
          <PlusCircle className='h-4 w-4' />
          {label || 'Add'}
        </>
      )}
    </button>
  );
}
