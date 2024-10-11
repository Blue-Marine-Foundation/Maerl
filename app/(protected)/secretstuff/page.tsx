import DisplayUserInfo from '@/components/display-user-info';
import { InfoIcon } from 'lucide-react';

export default async function ProtectedPage() {
  return (
    <div className='flex w-full flex-1 flex-col gap-12'>
      <div className='w-full'>
        <div className='flex items-center gap-3 rounded-md bg-accent p-3 px-5 text-sm text-foreground'>
          <InfoIcon size='16' strokeWidth={2} />
          This is a protected page that you can only see as an authenticated
          user
        </div>
      </div>
      <DisplayUserInfo />
    </div>
  );
}
