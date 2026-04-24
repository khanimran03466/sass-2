'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './useAuth';

export function useProtectedRoute(role) {
  const router = useRouter();
  const { loading, isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/login');
    }

    if (!loading && role && user?.role !== role) {
      router.replace('/dashboard');
    }
  }, [loading, isAuthenticated, user, role, router]);

  return { loading, isAuthenticated, user };
}
