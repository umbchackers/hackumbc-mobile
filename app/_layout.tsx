import '@expo/metro-runtime';
import { Stack } from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';
import LogoutButton from '@/components/LogoutButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, StatusBar, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import { BlurView } from 'expo-blur';

import '@/amplify.config';
import 'react-native-get-random-values';

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

  //fonts
const [fontsLoaded] = useFonts({
    'LilitaOne': require('../assets/fonts/LilitaOne-Regular.ttf'),
    'Lemon': require('../assets/fonts/Lemon-Regular.ttf'),
  });
if (!fontsLoaded) {
    return null; // or a loading indicator maybe idk
}
  return (
    // This View now serves as the canvas for the universal background gradient.
    <View style={{ flex: 1 }}>
      
      <LinearGradient
        colors={['#D7FFED', '#E37302']} // Your desired app-wide gradient colors
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject} 
      />
      <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <AuthProvider>
          <AuthLoadingWrapper>
            <Stack>
              <Stack.Screen name="login" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
            <LogoutButton />
          </AuthLoadingWrapper>
        </AuthProvider>
      </SafeAreaView>
    </View>
  );
}