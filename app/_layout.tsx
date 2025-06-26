import '@expo/metro-runtime';
import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import '@/amplify.config';
import 'react-native-get-random-values';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}