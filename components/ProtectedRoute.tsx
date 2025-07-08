import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '@/types';
import { validateRoles } from '@/lib/util';

export function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: UserRole[] }) {
  const { loggedIn, roles, isInitializing } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isInitializing && (!loggedIn || !validateRoles(allowedRoles, roles))) {
      router.replace('/login');
    }
  }, [loggedIn, roles, isInitializing]);

  if (!isInitializing && (!loggedIn || !validateRoles(allowedRoles, roles))) {
    return null;
  }

  return <>{children}</>;
}