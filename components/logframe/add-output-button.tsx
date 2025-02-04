'use client';

import { useState } from 'react';
import ActionButton from '@/components/ui/action-button';
import OutputForm from './output-form';
import { Output } from '@/utils/types';

export default function AddOutputButton({
  projectId,
  output,
}: {
  projectId: number;
  output: Output | null;
}) {
  const [isOutputDialogOpen, setIsOutputDialogOpen] = useState(false);

  return (
    <div className='flex items-center justify-center rounded-md border border-dashed p-12'>
      <ActionButton
        action='add'
        label='Add output'
        onClick={() => setIsOutputDialogOpen(true)}
      />
      <OutputForm
        isOpen={isOutputDialogOpen}
        onClose={() => setIsOutputDialogOpen(false)}
        output={output}
        projectId={projectId}
      />
    </div>
  );
}
