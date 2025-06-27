import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '@/types';
import { validateRoles } from '@/lib/util';

export function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: UserRole[] }) {
  const { loggedIn, roles } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loggedIn || (!validateRoles(allowedRoles, roles) || roles === null)) {
      router.replace('/');
    }
  }, [loggedIn, roles]);

  return <>{children}</>;
}