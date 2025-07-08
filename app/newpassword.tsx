import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export default function NewPasswordScreen() {
  const router = useRouter();
  const { completeNewPassword, loggedIn, isInitializing } = useAuth();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isInitializing) {
    return null;
  }

  if (loggedIn) {
    router.replace('/');
    return null;
  }

  const validatePassword = (password: string): string | null => {
    if (!password.trim()) {
      return 'Password is required.';
    }
    if (password.length < 8) {
      return 'Password must be at least 8 characters long.';
    }
    return null;
  };

  const parseCognitoError = (err: any): string => {
    if (err instanceof Error) {
      const message = err.message.toLowerCase();
      
      return err.message;
    }
    return 'Failed to update password. Please try again.';
  };

  const handleSubmit = async () => {
    setError('');

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    
    try {
      await completeNewPassword(newPassword);
    } catch (err) {
      console.error('Password change failed:', err);
      const errorMessage = parseCognitoError(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set New Password</Text>
      <Text style={styles.subtitle}>
        Your account requires a new password. Please create a secure password.
      </Text>

      <TextInput
        placeholder="New Password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
        style={styles.input}
        editable={!loading}
      />

      <TextInput
        placeholder="Confirm New Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        style={styles.input}
        editable={!loading}
      />

      <View style={styles.info}>
        <Text style={styles.infoText}>
          Password must meet your organization's security requirements.
        </Text>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button 
        title={loading ? 'Updating Password...' : 'Set New Password'} 
        onPress={handleSubmit} 
        disabled={loading || !newPassword || !confirmPassword}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    lineHeight: 22,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 6,
    marginBottom: 15,
    fontSize: 16,
  },
  info: {
    backgroundColor: '#f0f8ff',
    padding: 12,
    borderRadius: 6,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  infoText: {
    fontSize: 14,
    color: '#333',
  },
  error: {
    color: 'red',
    marginBottom: 15,
    fontSize: 14,
  },
});
