import { useEffect } from 'react';
import { RelativePathString, useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '@/types';
import { validateRoles } from '@/lib/util';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireAuth?: boolean;
  redirectTo?: string;
  redirectWhenLoggedIn?: string;
}

export function ProtectedRoute({ 
  children, 
  allowedRoles, 
  requireAuth = true,
  redirectTo = '/',
  redirectWhenLoggedIn 
}: ProtectedRouteProps) {
  const { loggedIn, roles, isInitializing } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isInitializing) return;

    if (requireAuth) {
      if (!loggedIn) {
        console.log('User not authenticated, redirecting to:', redirectTo);
        router.replace(redirectTo as RelativePathString);
        return;
      }
      
      if (allowedRoles && !validateRoles(allowedRoles, roles)) {
        console.log('User lacks required roles, redirecting to home');
        router.replace('/');
        return;
      }
    } else {
      if (loggedIn && redirectWhenLoggedIn) {
        console.log('User already authenticated, redirecting to:', redirectWhenLoggedIn);
        router.replace(redirectWhenLoggedIn as RelativePathString);
        return;
      }
    }
  }, [loggedIn, roles, isInitializing, requireAuth, allowedRoles, redirectTo, redirectWhenLoggedIn]);

  if (isInitializing) {
    return null;
  }

  if (requireAuth) {
    if (!loggedIn) {
      return null;
    }
    if (allowedRoles && !validateRoles(allowedRoles, roles)) {
      return null;
    }
  }

  if (!requireAuth && loggedIn && redirectWhenLoggedIn) {
    return null;
  }

  return <>{children}</>;
}
