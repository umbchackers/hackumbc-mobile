import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import {
  fetchAuthSession,
  signIn,
  signOut,
  confirmSignIn
} from 'aws-amplify/auth';
import { AuthContextType, UserRole, UserState } from '@/types';
import { serializeRoles, deserializeRoles } from '@/lib/util';
import * as Notifications from 'expo-notifications';
import { createApi } from '@/lib/api';

type PushTokenAction = 'REGISTER' | 'UNREGISTER';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState({
    loggedIn: false,
    roles: null,
    idToken: null,
    accessToken: null,
  } as UserState);
  const [tokenExpiry, setTokenExpiry] = useState<Date | null>(null);
  const [challengeData, setChallengeData] = useState<any | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  const clearStoredAuth = async () => {
    try {
      await SecureStore.deleteItemAsync('idToken');
      await SecureStore.deleteItemAsync('accessToken');
      await SecureStore.deleteItemAsync('userRoles');
      
      setUser({ loggedIn: false, roles: null, idToken: null, accessToken: null });
      setTokenExpiry(null);
    } catch (error) {
      console.error('Error clearing stored auth:', error);
    }
  };

  const handlePushToken = async (action: PushTokenAction) => {
     try {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        console.log('Notification permissions not granted, cannot register token');
        return;
      }
      
      const tokenData = await Notifications.getExpoPushTokenAsync();
      const expoPushToken = tokenData.data;

      const idToken = user.idToken;
      const api = createApi(idToken);

      const response = await api.post<{ body: string, action: PushTokenAction }>('/admin/users/push_token', {
        expoPushToken,
        action
      }, false);

      console.log(response.body);
      console.log(`Push token ${action} successful`);
    }
    catch (error) {
      console.error('Error:', error);
    }
  }

  useEffect(() => {
    const validateAndLoadSession = async () => {
      try {
        setIsInitializing(true);
        
        const storedIdToken = await SecureStore.getItemAsync('idToken');
        const storedAccessToken = await SecureStore.getItemAsync('accessToken');
        const storedRolesString = await SecureStore.getItemAsync('userRoles');
        
        if (!storedAccessToken || !storedIdToken) {
          console.log('No stored tokens found');
          setIsInitializing(false);
          return;
        }

        const session = await fetchAuthSession();
        
        if (!session.tokens?.accessToken || !session.tokens?.idToken) {
          console.log('No valid Amplify session found, clearing stored data');
          await clearStoredAuth();
          setIsInitializing(false);
          return;
        }

        const currentTime = Math.floor(Date.now() / 1000);
        const tokenExp = session.tokens.accessToken.payload.exp!;
        
        if (tokenExp <= currentTime) {
          console.log('Token is expired, clearing stored data');
          await clearStoredAuth();
          setIsInitializing(false);
          return;
        }

        const storedRoles = storedRolesString ? deserializeRoles(storedRolesString) : null;
        const expiresIn = tokenExp - currentTime;
        const expiryDate = new Date(Date.now() + expiresIn * 1000);

        setUser({
          loggedIn: true,
          roles: storedRoles,
          idToken: storedIdToken,
          accessToken: storedAccessToken
        } as UserState);
        setTokenExpiry(expiryDate);
        
        console.log('Session restored successfully');
        
      } catch (error) {
        console.error('Error validating session:', error);
        await clearStoredAuth();
      } finally {
        setIsInitializing(false);
      }
    };

    validateAndLoadSession();
  }, []);

  useEffect(() => {
    if (!tokenExpiry) return;

    const interval = setInterval(async () => {
      if (tokenExpiry && new Date() > tokenExpiry) {
        console.log('Access token expired, logging out...');
        logout();
      }
    });

    return () => clearInterval(interval);
  }, [tokenExpiry]);

  const login = async (username: string, password: string) => {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const { isSignedIn, nextStep } = await signIn({username, password});
        if (isSignedIn) {
          const session = await fetchAuthSession();
          const idToken = session.tokens?.idToken?.toString()!;
          const accessToken = session.tokens?.accessToken?.toString()!;
          const expiresIn = session.tokens?.accessToken.payload.exp! - Math.floor(Date.now() / 1000);
          const expiryDate = new Date(Date.now() + expiresIn * 1000);
          const userRoles = session.tokens?.idToken?.payload['cognito:groups'] as UserRole[];

          await SecureStore.setItemAsync('idToken', idToken);
          await SecureStore.setItemAsync('accessToken', accessToken);
          await SecureStore.setItemAsync('userRoles', serializeRoles(userRoles));

          await handlePushToken('REGISTER');

          setUser({loggedIn: true, roles: userRoles, idToken, accessToken });
          setTokenExpiry(expiryDate);
          console.log('Cognito login success');
          resolve();
        }
        else if (nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
          setChallengeData(nextStep);
          reject({ challenge: 'NEW_PASSWORD_REQUIRED' })
        }
        else {
          console.log('Login failed');
          console.log(nextStep);
          reject();
        }
      }
      catch (err: any) {
        console.error(`err: ${err}`);
        reject(err);
      }
    });
  };

  const completeNewPassword = async (newPassword: string) => {
    return new Promise<void>(async (resolve, reject) => {
      if (!challengeData) throw new Error('No pending new password challenge ');
      try {
        await confirmSignIn({ challengeResponse: newPassword });
        const session = await fetchAuthSession();
        const idToken = session.tokens?.idToken?.toString()!;
        const accessToken = session.tokens?.accessToken?.toString()!;
        const expiresIn = session.tokens?.accessToken.payload.exp! - Math.floor(Date.now() / 1000);
        const expiryDate = new Date(Date.now() + expiresIn * 1000);
        const userRoles = session.tokens?.idToken?.payload['cognito:groups'] as UserRole[];

        await SecureStore.setItemAsync('idToken', idToken);
        await SecureStore.setItemAsync('accessToken', accessToken);
        await SecureStore.setItemAsync('userRoles', serializeRoles(userRoles));

        setUser({ loggedIn: true, roles: userRoles, idToken, accessToken });
        setTokenExpiry(expiryDate);
        setChallengeData(null);
        resolve();
      } catch (err) {
        console.error(`Complete new password error: ${err}`);
        reject(err);
      }
    });
  };

  const logout = async () => {
    await handlePushToken('UNREGISTER');

    try {
      await signOut();
      console.log('Amplify signOut successful');
    } catch (error) {
      console.error('Error during Amplify signOut:', error);
    }
    
    await clearStoredAuth();
    console.log('Logout completed');
  };

  return (
    <AuthContext.Provider value={{ ...user, isInitializing, login, logout, completeNewPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}