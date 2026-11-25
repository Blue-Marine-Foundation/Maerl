'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useUser } from '@/components/user/user-provider';
import type { Update } from '@/utils/types';
import UpdateForm from './update-form';

export default function EditUpdateDialog({ update }: { update: Update }) {
  const [isOpen, setIsOpen] = useState(false);
  const { isAdmin } = useUser();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className='rounded-md border px-2 py-1 text-muted-foreground'>
          Edit
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit update</DialogTitle>
        </DialogHeader>
        <UpdateForm
          outputMeasurable={update.output_measurables ?? undefined}
          outcomeMeasurable={update.outcome_measurables ?? undefined}
          impactIndicator={update.impact_indicators ?? undefined}
          projectId={update.project_id}
          update={update}
          isAdmin={isAdmin}
          onSuccess={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
