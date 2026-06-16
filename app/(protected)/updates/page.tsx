import { fetchCurrentUserProfile } from '@/api/fetch-current-user-profile';
import UpdatesDataTable from '@/components/updates/updates-data-table';
import type { UpdateScope } from '@/components/updates/server-actions';

type UpdatesPageSearchParams = {
  scope?: string | string[];
};

function getFirstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function UpdatesPages(props: {
  searchParams: Promise<UpdatesPageSearchParams>;
}) {
  const [currentUser, searchParams] = await Promise.all([
    fetchCurrentUserProfile(),
    props.searchParams,
  ]);

  const requestedScope = getFirstParam(searchParams.scope);
  const updateScope: UpdateScope =
    requestedScope === 'mine'
      ? 'current-user'
      : requestedScope === 'assigned' ||
          currentUser.profile?.role !== 'Super Admin'
        ? 'assigned-projects'
      : 'all';
  const title =
    updateScope === 'current-user'
      ? 'My updates'
      : updateScope === 'assigned-projects'
        ? 'Project updates'
        : 'Updates';

  return (
    <div className='flex min-w-0 flex-col gap-6'>
      <div className='flex items-baseline justify-between'>
        <h2 className='text-xl font-semibold'>{title}</h2>
      </div>
      <UpdatesDataTable updateScope={updateScope} />
    </div>
  );
}
