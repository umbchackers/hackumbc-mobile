import '@expo/metro-runtime';
import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import '@/amplify.config';
import 'react-native-get-random-values';
import LogoutButton from '@/components/LogoutButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function RootLayout() {
  return (
    <LinearGradient
      colors={['#c7efe6', '#f18e21']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <AuthProvider>
          <Stack>
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
          <LogoutButton />
        </AuthProvider>
      </SafeAreaView>
    </LinearGradient>
  );
}