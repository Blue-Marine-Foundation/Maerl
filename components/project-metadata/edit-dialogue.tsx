'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';
import { ProjectMetadata } from '@/utils/types';
import EditForm from './edit-form';

export default function EditDialogue({
  project,
}: {
  project: ProjectMetadata;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        role='button'
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
