'use client';

import { fetchCurrentUserProfile, type AppUserRole } from '@/api/fetch-current-user-profile';
import { useQuery } from '@tanstack/react-query';
import React, { createContext, useContext, useMemo } from 'react';

type UserContextValue = {
  isLoading: boolean;
  authUserId: string | null;
  role: AppUserRole | null;
  isAdmin: boolean;
  isPartner: boolean;
  canEditLogframe: boolean;
};

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { data, isLoading } = useQuery({
    queryKey: ['current-user-profile'],
    queryFn: fetchCurrentUserProfile,
    staleTime: 5 * 60 * 1000,
  });

  const value = useMemo<UserContextValue>(() => {
    const role = data?.profile?.role ?? null;
    const authUserId = data?.authUser?.id ?? null;
    const isAdmin = role === 'Admin';
    const isPartner = role === 'Partner';

    return {
      isLoading,
      authUserId,
      role,
      isAdmin,
      isPartner,
      canEditLogframe: !isPartner, // Partners are read-only for logframe structure
    };
  }, [data?.authUser?.id, data?.profile?.role, isLoading]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error('useUser must be used within UserProvider');
  }
  return ctx;
}

