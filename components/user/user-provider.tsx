'use client';

import { fetchCurrentUserProfile, type AppUserRole } from '@/api/fetch-current-user-profile';
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
    } = supabase.auth.onAuthStateChange(() => {
      void queryClient.resetQueries({ queryKey: CURRENT_USER_PROFILE_QUERY_KEY });
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
    const isAdmin = role === 'Admin';
    const isProjectManager = role === 'Project Manager';
    const isPartner = role === 'Partner';
    const hasManagerAccess = isAdmin || isProjectManager;

    return {
      isLoading,
      authUserId,
      role,
      isAdmin,
      isProjectManager,
      isPartner,
      hasManagerAccess,
      canEditLogframe: hasManagerAccess,
      canEditProjectMetadata: hasManagerAccess,
    };
  }, [data?.authUser?.id, data?.profile?.role, isLoading]);
}
