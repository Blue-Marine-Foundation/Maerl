'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';
import { ProjectMetadata } from '@/utils/types';
import EditForm from './edit-form';
import { useUser } from '@/components/user/user-provider';

export default function EditDialogue({
  project,
}: Readonly<{
  project: ProjectMetadata;
}>) {
  const { isPartner } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  if (isPartner) return null;

  return (
    <div>
      <button
        className='flex items-center gap-2 rounded-md border border-dashed px-2 py-1 text-sm text-foreground/80 transition-all hover:border-solid hover:border-foreground/50 hover:text-foreground'
        onClick={() => setIsOpen(true)}
      >
        Edit
      </button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogTitle>Edit Project Metadata: {project.name}</DialogTitle>
          <EditForm project={project} onClose={() => setIsOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
