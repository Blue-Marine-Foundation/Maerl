'use server';

import { createClient } from '@/utils/supabase/server';

export type AppUserRole = 'Admin' | 'Project Manager' | 'Partner';

export type UserProfile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: AppUserRole | null;
};

export type CurrentUserProfileResponse =
  | {
      authUser: {
        id: string;
        email?: string | null;
      };
      profile: UserProfile | null;
    }
  | {
      authUser: null;
      profile: null;
    };

export async function fetchCurrentUserProfile(): Promise<CurrentUserProfileResponse> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { authUser: null, profile: null };
  }

  const { data: profile } = await supabase
    .from('users')
    .select('id, first_name, last_name, role')
    .eq('id', user.id)
    .maybeSingle();

  return {
    authUser: {
      id: user.id,
      email: user.email,
    },
    profile: profile ?? null,
  };
}

