import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

// import { signIn, signOut } from 'aws-amplify/auth';
// import { auth } from '@/amplify/auth/resource';
// import { Auth } from 'aws-amplify';

//zWLjsZrH6<6wYe!wQru5jJxa>JSlyw9GYerTVh?>4@p2ohUZdGWY.?GH!R-gjB

// import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';

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
          console.log('Redirecting to new password page...');
          router.replace('/newpassword');
        }
      } else {
        console.error('Login failed', err);
        setError('Invalid username or password.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button
        title={loading ? 'Logging in...' : 'Login'}
        onPress={handleLogin}
        disabled={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  error: {
    color: 'red',
    marginBottom: 15,
  },
});
