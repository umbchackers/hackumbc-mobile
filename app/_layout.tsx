import '@expo/metro-runtime';
import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import '@/amplify.config';
import 'react-native-get-random-values';
import LogoutButton from '@/components/LogoutButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, StatusBar, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
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
          <Stack>
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
          <LogoutButton />
        </AuthProvider>
      </SafeAreaView>
    </View>
  );
}