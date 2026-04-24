'use client';

import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { SkeletonCard } from './SkeletonCard';

export function ProtectedPage({ role, children }) {
  const { loading, isAuthenticated, user } = useProtectedRoute(role);

  if (loading || !isAuthenticated || (role && user?.role !== role)) {
    return (
      <div className="min-h-screen p-6">
        <div className="mx-auto max-w-5xl">
          <SkeletonCard className="h-40" />
        </div>
      </div>
    );
  }

  return children;
}
