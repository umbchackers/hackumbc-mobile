import '@expo/metro-runtime';
import '@/amplify.config';
import 'react-native-get-random-values';
import { Stack } from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { View, ActivityIndicator, Text,StatusBar, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import LogoutButton from '@/components/LogoutButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import { ThemeProvider } from '@react-navigation/native';
import { TransparentTheme } from '../lib/theme';
import * as Updates from 'expo-updates';
import { useEffect } from 'react';

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
  useEffect(() => {
    const checkForUpdates = async () => {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          console.log('Fetching updates...');
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
      } catch (error) {
        console.log('Error checking for updates:', error);
      }
    }
    if (!__DEV__) {
      checkForUpdates();
    }
    else {
      console.log('Running in dev mode...');
    }
  }, []);

  // fonts
  const [fontsLoaded] = useFonts({
    'LilitaOne': require('../assets/fonts/LilitaOne-Regular.ttf'),
    'Lemon': require('../assets/fonts/Lemon-Regular.ttf'),
  });
  
  if (!fontsLoaded) {
    return null; 
  }
  
  return (
    <AuthProvider>
      <AuthLoadingWrapper>
        <ThemeProvider value={TransparentTheme}>
          <LinearGradient
            colors={['#D7FFED', '#E37302']} // app-wide gradient colors
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1 }}
          >
            <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
              <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
              <Stack
                screenOptions={{ 
                  headerShown: false,
                  animation: Platform.select({
                    ios: 'ios_from_right',
                    android: 'slide_from_right'
                  }),
                  presentation: 'card'
                }}
              >
                <Stack.Screen name="login" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              </Stack>
              <LogoutButton />
            </SafeAreaView>
          </LinearGradient>
        </ThemeProvider>
      </AuthLoadingWrapper>
    </AuthProvider>
  );
}