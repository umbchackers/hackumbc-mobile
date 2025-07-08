import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { loggedIn, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loggedIn || role !== 'admin') {
      router.replace('/');
    }
  }, [loggedIn, role]);

  return <>{children}</>;
}