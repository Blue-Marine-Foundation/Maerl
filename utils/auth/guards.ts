'use server';

import { fetchCurrentUserProfile } from '@/api/fetch-current-user-profile';
import { redirect } from 'next/navigation';

export async function requireNonPartner(redirectTo: string = '/projects') {
  const data = await fetchCurrentUserProfile();

  // If there's no DB profile, treat as unauthorized for restricted pages.
  const role = data.profile?.role ?? null;
  if (role === 'Partner' || role === null) {
    redirect(redirectTo);
  }

  return data.profile;
}

