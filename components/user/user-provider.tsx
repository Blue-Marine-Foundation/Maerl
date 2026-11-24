'use client';

import {
  fetchCurrentUserProfile,
  type AppUserRole,
  type CurrentUserProfileResponse,
} from '@/api/fetch-current-user-profile';
import { createClient as createSupabaseClient } from '@/utils/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';

type UserState = {
  isLoading: boolean;
  authUserId: string | null;
  role: AppUserRole | null;
  isAdmin: boolean;
  isProjectManager: boolean;
  isPartner: boolean;
  isSuperAdmin: boolean;
  hasManagerAccess: boolean;
  canEditLogframe: boolean;
  canEditProjectMetadata: boolean;
};

const CURRENT_USER_PROFILE_QUERY_KEY = ['current-user-profile'] as const;

export function UserSessionSync() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const supabase = createSupabaseClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      const cached = queryClient.getQueryData<CurrentUserProfileResponse>(
        CURRENT_USER_PROFILE_QUERY_KEY,
      );
      if (event === 'SIGNED_OUT') {
        void queryClient.cancelQueries({
          queryKey: CURRENT_USER_PROFILE_QUERY_KEY,
        });
        queryClient.setQueryData(CURRENT_USER_PROFILE_QUERY_KEY, {
          authUser: null,
          profile: null,
        });
      } else if (cached && cached.authUser?.id !== session?.user.id) {
        // Clear permissions immediately when the account actually changes.
        void queryClient.resetQueries({
          queryKey: CURRENT_USER_PROFILE_QUERY_KEY,
        });
      } else if (event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        // Refresh in the background without briefly hiding same-user controls.
        void queryClient.invalidateQueries({
          queryKey: CURRENT_USER_PROFILE_QUERY_KEY,
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);

  return null;
}

export function useUser(): UserState {
  const { data, isLoading } = useQuery({
    queryKey: CURRENT_USER_PROFILE_QUERY_KEY,
    queryFn: fetchCurrentUserProfile,
    staleTime: 5 * 60 * 1000,
  });

  return useMemo<UserState>(() => {
    const role = data?.profile?.role ?? null;
    const authUserId = data?.authUser?.id ?? null;
    const isProjectManager = role === 'Project Manager';
    const isPartner = role === 'Partner';
    const isSuperAdmin = role === 'Super Admin';
    // Admin-quality update fields and edit-any-update in logframe (not review-only tools).
    const isAdmin = role === 'Admin' || isSuperAdmin;
    const hasManagerAccess = isAdmin || isProjectManager;

    return {
      isLoading,
      authUserId,
      role,
      isAdmin,
      isProjectManager,
      isPartner,
      isSuperAdmin,
      hasManagerAccess,
      canEditLogframe: hasManagerAccess,
      canEditProjectMetadata: hasManagerAccess,
    };
  }, [data?.authUser?.id, data?.profile?.role, isLoading]);
}
