import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoRefreshToken,
} from 'amazon-cognito-identity-js';
import AsyncStorage  from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

interface AuthContextType {
  loggedIn: boolean;
  role: string | null;
  accessToken: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const poolData = {
  UserPoolId: process.env.EXPO_PUBLIC_COGNITO_USER_POOL_ID ?? '',
  ClientId: process.env.EXPO_PUBLIC_COGNITO_CLIENT_ID ?? '',
};
const userPool = new CognitoUserPool({ UserPoolId: poolData.UserPoolId, ClientId: poolData.ClientId });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState({ loggedIn: false, role: null as string | null, accessToken: null as string | null });
  const [tokenExpiry, setTokenExpiry] = useState<Date | null>(null);

  useEffect(() => {
    const loadStoredToken = async () => {
      let storedAccessToken;
      let storedRefreshToken;
      if (Platform.OS === 'web') {
        storedAccessToken = await AsyncStorage.getItem('accessToken');
        storedRefreshToken = await AsyncStorage.getItem('refreshToken');
      }
      else {
        storedAccessToken = await SecureStore.getItemAsync('accessToken');
        storedRefreshToken = await SecureStore.getItemAsync('refreshToken');
      }

      if (storedAccessToken) {
        setUser({ loggedIn: true, role: 'admin', accessToken: storedAccessToken });
        const tempExpiry = new Date(Date.now() + 3600 * 1000);
        setTokenExpiry(tempExpiry);
      } else if (storedRefreshToken) {
        await tryRefreshToken(storedRefreshToken);
      }
    }
    loadStoredToken();
  }, []);

  useEffect(() => {
    if (!tokenExpiry) return;

    const interval = setInterval(async () => {
      if (tokenExpiry && new Date() > tokenExpiry) {
        console.log('Access token expired, trying to refresh...');
        let storedRefreshToken;
        if (Platform.OS === 'web') {
          storedRefreshToken = await AsyncStorage.getItem('refreshToken');
        }
        else {
          storedRefreshToken = await SecureStore.getItemAsync('refreshToken');
        }
        if (storedRefreshToken) {
          await tryRefreshToken(storedRefreshToken);
        } else {
          logout();
        }
      }
    }, 1000 * 60);

    return () => clearInterval(interval);
  }, [tokenExpiry]);

  const login = async (username: string, password: string) => {
    return new Promise<void>((resolve, reject) => {
      const cognitoUser = new CognitoUser({
        Username: username,
        Pool: userPool,
      });

      const authDetails = new AuthenticationDetails({
        Username: username,
        Password: password
      });

      cognitoUser.authenticateUser(authDetails, {
        onSuccess: async (result) => {
          const accessToken = result.getAccessToken().getJwtToken();
          const refreshToken = result.getRefreshToken().getToken();
          const expiresIn = result.getAccessToken().getExpiration() - Math.floor(Date.now() / 1000);
          const expiryDate = new Date(Date.now() + expiresIn * 1000);

          if (Platform.OS === 'web') {
            await AsyncStorage.setItem('accessToken', accessToken);
            await AsyncStorage.setItem('refreshToken', refreshToken);
          }
          else {
            await SecureStore.setItemAsync('accessToken', accessToken);
            await SecureStore.setItemAsync('refreshToken', refreshToken);
          }

          setUser({ loggedIn: true, role: 'admin', accessToken });
          setTokenExpiry(expiryDate);

          console.log('Cognito login success', { accessToken });
          resolve();
        },
        onFailure: (err) => {
          console.error('Cognito login failure', err);
          reject(err);
        },
      });
    });
  };

  const tryRefreshToken = async (storedRefreshToken: string) => {
    return new Promise<void>((resolve, reject) => {
      const currentUser = userPool.getCurrentUser();

      if (!currentUser) {
        logout();
        reject();
        return;
      }

      currentUser.refreshSession(
        new CognitoRefreshToken({ RefreshToken: storedRefreshToken }),
        async (err, session) => {
          if (err) {
            console.error('Refresh token failed:', err);
            logout();
            reject();
            return;
          }

          const newAccessToken = session.getAccessToken().getJwtToken();
          const expiresIn = session.getAccessToken().getExpiration() - Math.floor(Date.now() / 1000);
          const expiryDate = new Date(Date.now() + expiresIn * 1000);

          if (Platform.OS === 'web') {
            await AsyncStorage.setItem('acessToken', newAccessToken);
          }
          else {
            await SecureStore.setItemAsync('accessToken', newAccessToken);
          }

          setUser({ loggedIn: true, role: 'admin', accessToken: newAccessToken });
          setTokenExpiry(expiryDate);

          console.log('Successfully refreshed token');
          resolve();
        }
      );
    });
  };

  const logout = async () => {
    const currentUser = userPool.getCurrentUser();
    currentUser?.signOut();

    if (Platform.OS === 'web') {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
    }
    else {
      await SecureStore.deleteItemAsync('accessToken');
      await SecureStore.deleteItemAsync('refreshToken');
    }
    setUser({ loggedIn: false, role: null, accessToken: null });
    setTokenExpiry(null);
  };

  return (
    <AuthContext.Provider value={{ ...user, login, logout }}>
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