import '@expo/metro-runtime';
import { Stack } from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';
import '@/amplify.config';
import 'react-native-get-random-values';
import { View, ActivityIndicator, Text } from 'react-native';
import { BlurView } from 'expo-blur';

function AuthLoadingWrapper({ children }: { children: React.ReactNode }) {
  const { isInitializing } = useAuth();

  return (
    <View style={{ flex: 1 }}>
      <View 
        style={{ 
          flex: 1,
          opacity: isInitializing ? 0.3 : 1,
        }}
        pointerEvents={isInitializing ? 'none' : 'auto'}
      >
        {children}
      </View>
      {isInitializing && (
        <BlurView 
          intensity={25} 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
          }}
          pointerEvents="box-none"
        >
          <View style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            padding: 24,
            borderRadius: 16,
            alignItems: 'center',
            minWidth: 120,
          }} pointerEvents="auto">
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={{
              marginTop: 12,
              fontSize: 16,
              color: '#333',
              fontWeight: '500',
            }}>Loading...</Text>
          </View>
        </BlurView>
      )}
    </View>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthLoadingWrapper>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="newpassword" options={{ headerShown: false }} />
        </Stack>
      </AuthLoadingWrapper>
    </AuthProvider>
  );
}