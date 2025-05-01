import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { createApi } from '../../lib/api';
import { User } from '@/types/User';

export default function ScanScreen() {
  const { idToken } = useAuth();
  const api = createApi(idToken);

  const [email, setEmail] = useState('');
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLookup = async () => {
    setLoading(true);
    setError(null);
    setUserInfo(null);

    try {
      const response = await api.post<{ body: string }>('/admin/users', { email }, false);
      setUserInfo(JSON.parse(response.body));

    } catch (err) {
      console.error('Lookup failed', err);
      setError('User not found or error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan - Get User Info</Text>

      <TextInput
        placeholder="Enter user email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={styles.input}
      />

      <Button
        title={loading ? 'Looking up...' : 'Lookup User'}
        onPress={handleLookup}
        disabled={loading || email.length === 0}
      />

      {error && <Text style={styles.error}>{error}</Text>}

      {userInfo && (
        <View style={styles.userInfo}>
          <Text style={styles.userText}>Name: {userInfo.full_name}</Text>
          <Text style={styles.userText}>Age: {userInfo.age}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 50,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 6,
    marginBottom: 15,
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
  userInfo: {
    marginTop: 20,
  },
  userText: {
    fontSize: 18,
    marginBottom: 5,
  },
});