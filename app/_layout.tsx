import '@expo/metro-runtime';
import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import '@/amplify.config';
import 'react-native-get-random-values';
import LogoutButton from '@/components/LogoutButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';

export default function RootLayout() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5b2b2' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5b2b2" />
      <AuthProvider>
        <Stack>
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        <LogoutButton />
      </AuthProvider>
    </SafeAreaView>
  );
}