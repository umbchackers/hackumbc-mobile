import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { loggedIn, isInitializing } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isInitializing) return;

    const inAuthGroup = segments[0] === '(tabs)';
    const inPublicRoute = segments[0] === 'login' || segments[0] === 'newpassword';

    if (!loggedIn) {
      if (inAuthGroup) {
        console.log('User not authenticated, redirecting to login');
        router.replace('/login');
      }
    } else {
      if (inPublicRoute) {
        console.log('User already authenticated, redirecting to home');
        router.replace('/');
      }
    }
  }, [loggedIn, isInitializing, segments]);

  return <>{children}</>;
}
