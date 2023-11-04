import UserGroup from '@/components/RLSTests/userGroup';
import UserProfile from '@/components/RLSTests/userProfile';
import GroupProfiles from '@/components/RLSTests/groupProfiles';
import ProfileData from '@/components/RLSTests/profileData';
import PostData from '@/_components/RLSTests/postData';

export default function RLS() {
  return (
    <div className='max-w-6xl mx-auto'>
      <div className='flex items-start gap-4'>
        <div className='flex flex-col basis-1/3 gap-4'>
          <UserProfile />
          <UserGroup />
        </div>
        <div className='basis-1/3'>
          <GroupProfiles />
        </div>
        <div className='flex flex-col basis-1/3 gap-4'>
          <ProfileData />
          <PostData />
        </div>
      </div>
    </div>
  );
}
