'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';
import { ProjectMetadata } from '@/utils/types';

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
        onClick={() => setIsOpen(!isOpen)}
      >
        Edit
      </button>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <div className='sr-only'>
              <DialogTitle>Project metadata editing view</DialogTitle>
            </div>
            <div className='flex items-center justify-between gap-4'>
              <div className='flex items-center justify-start gap-4'>
                <h2 className='text-lg font-semibold'>{project.name}</h2>
              </div>
            </div>

            <div className='text-sm'>
              <p>Stuff here</p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
