import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
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
    <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      {/* button so u can go back to home, not (strand- not to be confused with the dark subclass)ed ts */}
      <Pressable
        style={{ position: 'absolute', top: 18, left: 18, zIndex: 10, flexDirection: 'row', alignItems: 'center' }}
        onPress={() => router.replace('/')}
      >
        <Ionicons name="arrow-back" size={28} color="#E37302" />
        <Text style={{ color: '#E37302', fontWeight: 'bold', fontSize: 16, marginLeft: 4 }}>Home</Text>
      </Pressable>
      <LinearGradient
        colors={['#D7FFED', '#E37302']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[StyleSheet.absoluteFill, styles.screen]}
      >
        <View style={styles.overlay} />
        <View style={styles.cardWrapper}>
          <LinearGradient
            colors={['rgba(215,255,237,0.47)', 'rgba(244,255,234,0.47)']}
            start={{ x: 0.2, y: 0.0 }}
            end={{ x: 1.0, y: 1.0 }}
            style={styles.card}
          >
            {/* hack logo (dawg) */}
            <Image
              source={require('../assets/images/hackumbcdog2025.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            {/* hackUMBC wordmark */}
            <Image
              source={require('../assets/images/hacklogo2025.png')}
              style={styles.wordmark}
              resizeMode="contain"
            />
            {/* username input */}
            <TextInput
              placeholder="USERNAME"
              placeholderTextColor="#E37302"
              value={username}
              onChangeText={setUsername}
              style={styles.input}
              autoCapitalize="none"
            />
            {/* password input */}
            <TextInput
              placeholder="PASSWORD"
              placeholderTextColor="#E37302"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
            />
            {error && <Text style={styles.error}>{error}</Text>}
            {/* login button with flowers */}
            <View style={styles.loginButtonRow}>
              <Pressable style={styles.button} onPress={handleLogin} disabled={loading}>
                <Text style={styles.buttonText}>{loading ? '...' : 'Login'}</Text>
                {/* top right flower */}
                <Image
                  source={require('../assets/images/flower-asset-5.png')}
                  style={styles.flower}
                />
                {/* bottom left flower */}
                <Image
                  source={require('../assets/images/flower-asset-3.png')}
                  style={styles.flowerLeft}
                />
              </Pressable>
            </View>
          </LinearGradient>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.24)',
  },
  cardWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  card: {
    width: 333,
    paddingVertical: 40,
    paddingHorizontal: 44,
    borderRadius: 39,
    shadowColor: '#E37302',
    shadowOffset: { width: 24, height: 47 },
    shadowOpacity: 0.62,
    shadowRadius: 41.6,
    elevation: 12,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  logo: { width: 155, height: 155, alignSelf: 'center' },
  wordmark: { width: 226, height: 124, alignSelf: 'center', marginTop: -10 },
  input: {
    width: '90%',
    alignSelf: 'center',
    height: 54,
    backgroundColor: '#EAFFEB',
    borderWidth: 1,
    borderColor: '#E37302',
    borderRadius: 13,
    paddingHorizontal: 16,
    fontFamily: 'LilitaOne',
    fontSize: 16,
    color: '#E37302',
    marginTop: 20,
  },
  loginButtonRow: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginTop: 24,
    marginBottom: 0,
    height: 60,
  },
  button: {
    alignSelf: 'center',
    zIndex: 2,
    backgroundColor: 'transparent',
    position: 'relative',
    minWidth: 120,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'LilitaOne',
    fontSize: 36,
    color: '#00695c',
    fontWeight: 'bold',
    letterSpacing: 2,
    textShadowColor: '#fff',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    paddingHorizontal: 16,
    borderWidth: 3,
    borderColor: '#EAFFF6',
  },
  flower: {
    position: 'absolute',
    right: -24,
    top: -10,
    width: 29,
    height: 29,
    zIndex: 3,
  },
  flowerLeft: {
    position: 'absolute',
    left: -28,
    bottom: -12,
    width: 32,
    height: 32,
    zIndex: 3,
  },
  error: { color: 'red', marginTop: 12, alignSelf: 'center' },
});