import AdminUpdateFilters from '@/components/admin/admin-update-filters';
import AdminUpdates from '@/components/admin/admin-updates';
import SetDateRange from '@/components/date-filtering/set-date-range';

export default function AdminPage() {
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-semibold'>Admin: manage updates</h2>
        <SetDateRange />
      </div>

      <div className='space-y-4'>
        <AdminUpdateFilters />
        <AdminUpdates />
      </div>
    </div>
  );
}
