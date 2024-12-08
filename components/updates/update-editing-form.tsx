import { Update } from '@/utils/types';

export default function UpdateEditingForm({ update }: { update: Update }) {
  return (
    <div>
      <p>{update.description}</p>
    </div>
  );
}
