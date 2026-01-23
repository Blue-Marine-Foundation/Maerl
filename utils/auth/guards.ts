'use server';

import { fetchCurrentUserProfile } from '@/api/fetch-current-user-profile';
import { redirect } from 'next/navigation';

export async function requireNonPartner(
  redirectTo: string = '/projects',
  noProfileRedirectTo: string = '/sign-in'
) {
  const data = await fetchCurrentUserProfile();

  if (!data.profile || data.profile.role === null) {
    redirect(noProfileRedirectTo);
  }

  if (data.profile.role === 'Partner') {
    redirect(redirectTo);
  }

  return data.profile;
}

