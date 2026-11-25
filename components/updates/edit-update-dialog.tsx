'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [latestUpdate, setLatestUpdate] = useState(update);
  const { isAdmin } = useUser();

  useEffect(() => {
    setLatestUpdate(update);
  }, [update]);

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
          outputMeasurable={latestUpdate.output_measurables ?? undefined}
          outcomeMeasurable={latestUpdate.outcome_measurables ?? undefined}
          impactIndicator={latestUpdate.impact_indicators ?? undefined}
          projectId={latestUpdate.project_id}
          update={latestUpdate}
          isAdmin={isAdmin}
          onSuccess={(saved) => {
            setLatestUpdate((prev) => ({ ...prev, ...saved }));
            setIsOpen(false);
            router.refresh();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
