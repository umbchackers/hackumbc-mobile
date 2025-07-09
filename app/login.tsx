import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Pressable, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// import { signIn, signOut } from 'aws-amplify/auth';
// import { auth } from '@/amplify/auth/resource';
// import { Auth } from 'aws-amplify';

//zWLjsZrH6<6wYe!wQru5jJxa>JSlyw9GYerTVh?>4@p2ohUZdGWY.?GH!R-gjB

// import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';

// hide the react-navigation header
export const options = { headerShown: false };
// i need a better workaround for this tbh

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await login(username, password);
      router.replace('/');
    } catch (err) {
      if (typeof err === 'object' && err !== null && 'challenge' in err) {
        if ((err as { challenge: string }).challenge === 'NEW_PASSWORD_REQUIRED') {
          router.replace('/newpassword');
        }
      } else {
        setError('Invalid username or password.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaContent}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* button so u can go back to home, not (strand- not to be confused with the dark subclass)ed ts */}
      <Pressable
        style={styles.backButton}
        onPress={() => router.replace('/')}
      >
        <Ionicons name="arrow-back" size={28} color="#E37302" />
        <Text style={styles.backButtonText}>Home</Text>
      </Pressable>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        {/* Main content wrapper, centers the card */}
        <View style={styles.centered}>
          <LinearGradient
            colors={['rgba(215,255,237,0.47)', 'rgba(244,255,234,0.47)']}
            start={{ x: 0.07, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.card}
          >
            <Image source={require('../assets/images/hackumbcdog2025.png')} style={styles.logoIcon} />
            <Image source={require('../assets/images/hacklogo2025.png')} style={styles.logoText} />
            <TextInput
              style={styles.input}
              placeholder="USERNAME"
              placeholderTextColor="#E37302"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="PASSWORD"
              placeholderTextColor="#E37302"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
              <View style={styles.loginTextContainer}>
                {/* Red flower: bottom left, overlap the "L" */}
                <Image source={require('../assets/images/flower-asset-3.png')} style={styles.flowerLeft} />
                {/* Login text, center */}
                <Text style={styles.loginText}>{loading ? 'Login' : 'Login'}</Text>
                {/* Yellow flower: top right, overlap the "n"/star */}
                <Image source={require('../assets/images/flower-asset-5.png')} style={styles.flowerRight} />
              </View>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaContent: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? ((StatusBar.currentHeight ?? 0) + 10) : 18,
    left: 18,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#E37302',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 4,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: 333,
    height: 521,
    borderRadius: 39,
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    justifyContent: 'flex-start',
  },
  logoIcon: {
    width: 155,
    height: 155,
    padding: 0,
    resizeMode: 'contain',
    marginBottom: -50,
  },
  logoText: {
    width: 226,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  input: {
    width: 249,
    height: 44,
    borderWidth: 1,
    borderColor: '#E37302',
    backgroundColor: '#EAFFEB',
    borderRadius: 13,
    paddingHorizontal: 12,
    fontFamily: 'LilitaOne',
    fontSize: 14,
    color: '#E37302',
    marginVertical: 10,
    textAlign: 'left',
    fontWeight: '400',
  },
  loginButton: {
    width: 120,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 24,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  loginTextContainer: {
    width: 101,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  loginText: {
    fontFamily: 'Lemon',
    fontSize: 32,
    color: '#0C6366',
    textShadowColor: '#EAFFF6',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 1,
    zIndex: 2,
  },
  flowerLeft: {
    position: 'absolute',
    left: -14,
    bottom: 0,
    width: 19,
    height: 19,
    resizeMode: 'contain',
    zIndex: 1,
  },
  flowerRight: {
    position: 'absolute',
    right: -25,
    top: 3,
    width: 29,
    height: 29,
    resizeMode: 'contain',
    zIndex: 3,
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
});