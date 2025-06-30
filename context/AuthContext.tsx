import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage  from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import {
  fetchAuthSession,
  signIn,
  signOut,
  confirmSignIn
} from 'aws-amplify/auth';

interface AuthContextType {
  loggedIn: boolean;
  role: string | null;
  idToken: string | null;
  accessToken: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  completeNewPassword: (newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState({ loggedIn: false, role: null as string | null, idToken: null as string | null, accessToken: null as string | null });
  const [tokenExpiry, setTokenExpiry] = useState<Date | null>(null);
  const [challengeData, setChallengeData] = useState<any | null>(null);

  useEffect(() => {
    const loadStoredToken = async () => {
      let storedIdToken;
      let storedAccessToken;
      if (Platform.OS === 'web') {
        storedIdToken = await AsyncStorage.getItem('idToken');
        storedAccessToken = await AsyncStorage.getItem('accessToken');
      }
      else {
        storedIdToken = await SecureStore.getItemAsync('idToken');
        storedAccessToken = await SecureStore.getItemAsync('accessToken');
      }

      if (storedAccessToken) {
        const session = await fetchAuthSession();
        const expiresIn = session.tokens?.accessToken.payload.exp! - Math.floor(Date.now() / 1000);
        const expiryDate = new Date(Date.now() + expiresIn * 1000);

        setUser({ loggedIn: true, role: 'admin', idToken: storedIdToken, accessToken: storedAccessToken });
        setTokenExpiry(expiryDate);
      } 
    }
    loadStoredToken();
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
        // await signOut();
        const { isSignedIn, nextStep } = await signIn({username, password});
        if (isSignedIn) {
          const session = await fetchAuthSession();
          const idToken = session.tokens?.idToken?.toString()!;
          const accessToken = session.tokens?.accessToken?.toString()!;
          const expiresIn = session.tokens?.accessToken.payload.exp! - Math.floor(Date.now() / 1000);
          const expiryDate = new Date(Date.now() + expiresIn * 1000);
          
          if (Platform.OS === 'web') {
            await AsyncStorage.setItem('idToken', idToken);
            await AsyncStorage.setItem('accessToken', accessToken);
          }
          else {
            await SecureStore.setItemAsync('idToken', idToken);
            await SecureStore.setItemAsync('accessToken', accessToken);
          }
          // TODO implement roles with Cognito user groups
          setUser({ loggedIn: true, role: 'admin', idToken, accessToken });
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
        
        if (Platform.OS === 'web') {
          await AsyncStorage.setItem('idToken', idToken);
          await AsyncStorage.setItem('accessToken', accessToken);
        }
        else {
          await SecureStore.setItemAsync('idToken', idToken);
          await SecureStore.setItemAsync('accessToken', accessToken);
        }

        setUser({ loggedIn: true, role: 'admin', idToken, accessToken });
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
    await signOut();
    
    if (Platform.OS === 'web') {
      await AsyncStorage.removeItem('idToken');
      await AsyncStorage.removeItem('accessToken');
    }
    else {
      await SecureStore.deleteItemAsync('idToken');
      await SecureStore.deleteItemAsync('accessToken');
    }
    setUser({ loggedIn: false, role: null, idToken: null, accessToken: null });
    setTokenExpiry(null);
  };

  return (
    <AuthContext.Provider value={{ ...user, login, logout, completeNewPassword }}>
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